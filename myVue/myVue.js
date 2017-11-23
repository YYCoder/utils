/**
 * 订阅者
 * @param {[type]}   name  [description]
 * @param {[type]}   model [description]
 * @param {Function} cb    [description]
 */
function Watcher(name, model, cb) {
  this.cb = cb;
  this.model = model;
  this.name = name;
  // 将自身加入指定发布者中
  this.addToDep();
}
Watcher.prototype.callback = function () {
  this.cb();
}
Watcher.prototype.addToDep = function () {
  Dep.target = this;
  // 强制触发获取指定监听属性，从而将自身加入指定发布者中
  this.model.data[this.name];
  Dep.target = null;
}
/**
 * 发布者
 */
function Dep() {
  this.watchers = [];
}
// 通过该属性添加watcher
Dep.target = null;
Dep.prototype = {
  addWatcher: function (w) {
    this.watchers.push(w);
  },
  publish: function () {
    this.watchers.forEach(function (w) {
      w.callback();
    });
  }
};
/**
 * 数据劫持者
 * @param {[type]} model [description]
 */
function Observer(model) {
  var self = this;
  Object.keys(model.data || model).forEach(function (k) {
    self.defineRactive(model, k);
  });
}
Observer.prototype.defineRactive = function (model, k) {
  var value = model.data && model.data[k] || model[k];
  // 添加发布者，每个属性一个发布者，可以有多个订阅者，通过闭包保存在内存中
  var dep = new Dep();
  Object.defineProperty(model.data || model, k, {
    enumerable: true,
    configurable: true,
    get: function () {
      // 将新建的watcher添加进指定属性的dep中
      if (Dep.target) {
        dep.addWatcher(Dep.target);
      }
      return value;
    },
    set: function (newVal) {
      if (value !== newVal) {
        value = newVal
        dep.publish();
      }
    }
  });
  // 若值本身是一个对象，则递归
  if (typeof value === 'object' && Object.keys(value).length > 0) {
    new Observer(value);
  }
}
/**
 * 编译器
 */
function Compiler(model, el) {
  if (el) {
    this.model = model;
    this.el = el;
    this.fragment = null;
    this.textReg = /\{\{(.+)\}\}/;
    this.dirReg = /v\-(\w+(\-\w+)*)/;
    this.directive = {
      'show': this.showDirective.bind(this),
      'if': this.ifElseDirective.bind(this),
      'else': this.ifElseDirective.bind(this),
      'model': this.modelDirective.bind(this)
    };
    this.init();
  }
};
Compiler.prototype.init = function () {
  var self = this;
  var el = this.el;
  var child = el.firstChild;
  this.fragment = document.createDocumentFragment();
  // 将#app的所有子节点加入documentFragment中，以便后续编译
  while (child) {
    this.fragment.appendChild(child);
    child = el.firstChild;
  }
  this.compileDOM(this.fragment);
  // 编译结束
  el.appendChild(this.fragment);
};
Compiler.prototype.compileDOM = function (DOM) {
  var self = this;
  var childNodes = DOM.childNodes;
  [].slice.call(childNodes).forEach(function (ele) {
    if (self.isTextNode(ele) && self.textReg.test(ele.nodeValue)) {
      self.compileText(ele, self.textReg.exec(ele.nodeValue)[1]);
    }
    else if (self.isElementNode(ele)) {
      self.compileElement(ele);
    }
    // 若节点还有子节点，则递归
    if (ele.childNodes.length > 0) {
      self.compileDOM(ele);
    }
  });
};
Compiler.prototype.compileText = function (text, attr) {
  // 初始化该节点值
  text.nodeValue = this.model[attr];
  // 添加订阅者
  new Watcher(attr, this.model, function () {
    var value = this.model[attr];
    if (value !== undefined) {
      text.nodeValue = value;
    }
    else {
      console.error('Error: 属性为undefined !');
    }
  });
}
Compiler.prototype.compileElement = function (node) {
  var self = this;
  var attrs = [].slice.call(node.attributes);
  attrs.forEach(function (attr) {
    var attrName = attr.nodeName;
    var directiveName = '';
    if (self.isDirective(attrName)) {
      directiveName = attrName.match(self.dirReg)[1];
      // 调用指定指令方法
      self.directive[directiveName](attr, node);
      // 删除节点属性
      node.removeAttribute(attr.nodeName);
    }
    else if (self.isEventDirective(attrName)) {
      self.eventDirective(attr, node);
      // 删除节点属性
      node.removeAttribute(attr.nodeName);
    }
  });
}
Compiler.prototype.showDirective = function (attr, node) {
  var self = this;
  if (attr.nodeName.indexOf('v-show') !== -1) {
    new Watcher(attr.value, self.model, function () {
      self.model[attr.value] ? node.style.display = 'block'
                             : node.style.display = 'none';
    });
  }
}
Compiler.prototype.modelDirective = function (attr, node) {
  var self = this;
  var attrName = attr.value;
  // 初始化节点中的值
  node.value = self.model[attrName];
  if ((node.nodeName === 'INPUT' && node.type !== 'checkbox' && node.type !== 'radio')
    || node.nodeName === 'TEXTAREA') {
    new Watcher(attrName, self.model, function () {
      node.value = self.model[attrName];
    });
    node.addEventListener('input', function () {
      self.model[attrName] = node.value;
    }, false);
  }
  else {
    console.error('Error: model指令只能用在input和textarea中');
  }
}
Compiler.prototype.ifElseDirective = function (attr, node) {
  
}
Compiler.prototype.eventDirective = function (attr, node) {
  var event = attr.nodeName.match(/(@|v\-on:)(\w+)/);
  var callback = attr.value;
  var self = this;
  if (event && event[2]) {
    if (self.model[callback]) {
      node.addEventListener(event[2], self.model[callback].bind(self.model), false);
    }
    else {
      console.error('Error: model中不存在指定方法');
    }
  }
  else {
    console.error('Error: 请正确使用v-on或@指令');
  }
}
Compiler.prototype.isDirective = function (attr) {
  var directiveMatch = attr.match(this.dirReg);
  return directiveMatch && this.directive[directiveMatch[1]];
}
Compiler.prototype.isEventDirective = function (attr) {
  return attr.indexOf('@') !== -1 || attr.indexOf('v-on:') !== -1;
}
Compiler.prototype.isElementNode = function (node) {
  return node.nodeType === 1;
}
Compiler.prototype.isTextNode = function (node) {
  return node.nodeType === 3;
}
/**
 * 实例构造函数
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function myVue(obj) {
  var self = this;
  self.data = obj.data;
  self.el = document.querySelector(obj.el);
  // 将方法添加至实例
  Object.keys(obj.methods).forEach(function (k) {
    self[k] = obj.methods[k];
  });
  // 添加属性代理，从而可以直接操作实例修改绑定属性
  Object.keys(obj.data).forEach(function (k) {
    self.proxy(k);
  });
  // 添加数据监听
  new Observer(self);
  // 编译元素
  new Compiler(self, self.el);
}
myVue.prototype.proxy = function (k) {
  var self = this;
  Object.defineProperty(self, k, {
    enumerable: false,
    configurable: true,
    get: function proxyGetter() {
      return self.data[k];
    },
    set: function proxySetter(newVal) {
      self.data[k] = newVal;
    }
  });
};
