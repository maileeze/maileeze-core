> 注意：这现在还不是README，只是记录我做这个东西的过程，相当于一个CHANGELOG

## 技术选型

我们在做的这个东西本质上就是一个HTML处理和CSS解析+处理的工作，大体上也可以拆成HTML转换和CSS解析两个部分。

经过调研发现，开源社区已经有比较成熟的CSS处理方案`premailer`，且是针对邮件内联样式的方案，还有各种语言的实现（PHP、.NET、Ruby），CSS内联方案可以借鉴。

还有其他CSS插件如`mailwind`使编写时可以使用Tailwind CSS，也很方便，后续要考虑的就是如何整合这些工作流。

在HTML转换方面倒是没有已经完全造好的轮子，因此我打算从解析HTML AST开始。最开始打算手写Parser的，因为我们需要读取的信息量也不大，但是后来考虑到稳定性和开发效率的问题还是打算在网上使用现有的方案。

经过调研，我们又确定了三个工具方向

- parser5/htmlparser2 这种纯AST解析的
- jsdom 这种提供DOM环境的
- posthtml 这种类似parser工具包的

jsdom因为和我们的需求偏离有点多，我们也用不上那么多DOM功能，也仅仅是对语法树进行修改，因此最先被抛弃。

然后在posthtml和parser5方案上纠结了很久，因为我最开始做的功能仅限于HTML的解析，posthtml完全能满足我的要求，用parser也只是实现了一个walk来实现了posthmtl的同等功能。

但是最终我还是决定使用parser5，因为它更灵活，我除了根据HTML的语法树来替换和生成，还需要根据CSS来生成另一组页面，这个时候posthtml这种只能对现有HTML进行替换（正如其名，post-html就是对HTML进行后处理的工具）就不能满足需求了。

不过posthtml还是很有意思的一个工具，后续我应该会对它的源码还有postcss这些工具深入研究一番，在开发过程中借鉴了posthtml的设计思路，打算让整个编译过程插件化、过程化。

### 大致方案

现在大体的思路是这样的：

- 使用parser5，利用递归遍历实现posthtml的功能，将处理规则插件化，尽量做到兼容posthtml的插件
- 解析css语法树，建立css特征表，方便生成响应式的另一套页面
  - 实现优先级计算，避免冗余
  - 实现计算响应式设计的断点，自动生成对应页面
- 将类转化成内联样式
- 整体上使用了流程+插件的思路，即将整个编译过程划分成一个个独立的流程，每个流程中自己开发的部分又分为一个个可定制的插件，可广泛地自定义。整个编译流程可以分为很多个大流程，每一步都会得到完整的中间文件，这是为了允许只做到某一步，也是为了允许在中间任意插入流程
  - HTML预处理，类似于posthtml的处理流程，包括替换自定义组件【component和responsive，responsive怎么解析我还没想好，可以先生成两套div，后期再转化成表格】、删除多余的注释和空白，生成符合HTML5的HTML【这一步可以根据插件来定义预处理规则，类比posthtml】
  - CSS预处理，如`tailwind-css`解析【这一步是使用中间产物套外部包，不能控制内部行为】
  - 在这一步就可以预览了
  - CSS解析，得到CSS语法树，为HTML生成做准备，将所有响应式信息汇总到媒体查询中
  - HTML生成，包括块级元素到table/tr/td的转化，还有多套响应式ui的生成【在html中替换div的过程和第一步是类似的，逻辑可以直接复用，生成响应式布局不太一样，还没想好】

在响应式生成这方面还没想好：

- responsive是自定义标签，在第一步就需要翻译，初步考虑是先变成div和媒体查询切换的形式
- 也就是说第一步把responsive转成媒体查询，第三步把grid也变成媒体查询，最后生成的时候直接看媒体查询就行了

HTML的转换逻辑我画了一个流程图（推荐使用免费开源的draw.io，不要再给wps交钱了），如下：

![流程图.drawio (2)](https://picgo-1308055782.cos.ap-chengdu.myqcloud.com/picgo-new/202304281446784.png)

## 关于parse5

个人对parser5的理解还不是很深入，最开始我就一直在研究要怎么解析html得到ast，然后又在研究怎么处理ast。

根据我的了解，parse5里直接调用`parse`和`Parser.parse`没啥太大区别；`parseFragment`就是parse一个小部分，没有完整html，这个没有过多研究。

`parse`得到的是一个`document`对象，但是很坑的是在typescript里这玩意儿默认的泛型是`unknown`的，导致我最开始只能用`any`然后转类型，还绕了一大堆弯路，像自己看它print的结果设置了一些interface呀之类的。

在GPT和别人的库代码的帮助下，后来才发现`parse5/dist/tree-adapters/default.d.ts`里有一堆能用的默认类型，气死我了，这下不得不好好看看源码了，实际上我发现parse5的好多工具库（如posthtml）的代码量都很小，包括它本身的代码量也不是特别大，直接看源码有时候反而更高效。

在用了`parse5/dist/tree-adapters/default.d.ts`给的类型后，终于拿到了带类型的ast可以开始处理了。这过程中我一直很好奇这个`TreeAdapter`是干嘛的，问了问GPT也不是很理解。

反正现在暂时用着默认就够了，也没有要对ast的呈现和修改方式进行自定义这样的需求在，如果有了再说呗，parse5虽然文档很操蛋，但是代码还是很简洁的，自定义程度也很高。

> Tree adapter是一组实用函数，提供了一个抽象层，将解析器和特定的AST格式之间进行最小必要的抽象化。需要注意的是，TreeAdapter并不是设计为通用的AST操作库。您可以在现有的TreeAdapter基础上构建这样的库，或者使用npm上已有的库之一。
>
> TreeAdapter是一个抽象层，其主要作用是将parse5生成的AST树映射为不同的AST格式。每种不同的AST格式都需要实现相应的TreeAdapter，以便于实现从parse5的AST树到目标AST格式的转换。

虽然但是，我还是不是很理解，感觉就是一个轻量的转换层，提供一些对ast操作的接口，然后允许你把ast转化成另一个形式这样，具体要怎么做我还得参考一下posthtml的实现。

然后我很自然地就想到了用递归遍历组件树，挨个进行修改，这个过程中也参考了一个简单的仓库来写，看看api接口。但是又被类型困住了，总之就是里面弯弯绕绕的类型太多，最后还是决定用`Node`类型统一，到里面只用判断有没有子node就可以了。

```typescript
import { Node, ParentNode } from "parse5/dist/tree-adapters/default";

export default function walk(node: Node, callback?: (element: Node) => void) {
  if (callback) callback(node);
  const parent = node as ParentNode;
  if (parent.childNodes) {
    parent.childNodes.forEach((child) => {
      walk(child, callback);
    });
  }
}
```

walk里可以用callback来实现一些编辑操作，经过一些封装就可以实现插件化的自定义系统。

在walk接入插件系统的时候也走了一些弯路，最后发现父组件在遍历子组件的时候就可以直接编辑，不用多做重复的工作，就把replace和filter合成一个rule，在遍历子组件的时候一起执行就行，只是replace始终返回true而已。

```typescript
export class RuleChain implements AstProcess {
  private rules: AstRule[] = [];

  private callbackFn: WalkerCallback = (node) => {
    // 这个逻辑下只用判断子节点，如果没有子节点就直接跳过
    const p = node as ParentNode;
    if (p.childNodes) {
      p.childNodes = p.childNodes.filter((child) => {
        // 判断它的每个子节点，节点本身在父节点中已经被判断过了
        let ret = true;
        for (let i = 0; i < this.rules.length; i += 1) {
          // 这里分别对子节点运行每个规则，规则既有确定节点是否保留，也有修改节点内容的
          const preserveNode = this.rules[i](child);
          if (!preserveNode) {
            ret = false; // 如果判断为删除就不用再运行后续了
            break;
          }
        }
        return ret;
      });
    }
  };

  public use(rule: AstRule): RuleChain {
    this.rules.push(rule);
    return this;
  }

  public process(node: Node): Node {
    walk(node, this.callbackFn);
    return node;
  }
}

export const ruleChain = () => new RuleChain();
```

最终在使用的时候实现了这样的代码就可以定义一个过程，就像posthtml一样：

```typescript
ruleChain()
    .use(ruleRemoveEmpty)
    .use(ruleRmoveComment)
    .use(ruleRemoveStyles)
    .process(ast);
```

到这里其实html的处理系统就完成得差不多了，大体就是用parse5手写了一个posthtml插件系统和traverse回调系统。

## 命令行工具开发

因为要做一个npm包嘛，那各种封装啊，调用啊，命令行肯定也是要做的。

### CLI 方案

`npm link [packageName]`可以为开发的模块(待发布的npm包)创造**一个全局链接**，在主项目里链接这个依赖的模块，进行测试。也就是可以直接**把当前的包名注册成一个命令**，放在shell的环境变量里方便调试。

`npm unlink`可以取消软链。

### 异常处理

### 测试方案

### 项目管理



## 开发过程中遇到的问题

### 关于d.ts类型声明文件的问题

- **ts-node无法识别d.ts中声明的类型**

> 在`tsconfig.json`里添加`ts-node: {files: true}`这个属性即可开启多文件识别，而不是之前的单入口解析

- **d.ts中需要引用其他类型，`import`后导致无法正常识别类型**

> `TypeScript` 与` ECMAScript 2015` 一样，任何包含顶级 `import` 或者 `export` 的文件都被当成一个模块。相反地，如果一个文件不带有顶级的 `import` 或者 `export` 声明，那么它的内容被视为全局可见的（因此对模块也是可见的），这就是为什么有时候没有引用某个 `.d.ts` 文件，但是在该 `.d.ts` 文件内部的类型定义在其它文件中仍然能检测得到，这是因为该 `.d.ts` 文件定义的类型已经变成全局的了。
>
> 但对于复杂的类型而言，引用是不可避免地，**我们可以通过创建全局命名空间的方式，将想要使用的类型声明挂载到全局命名空间**上，再在另一个d.ts中用命名空间再声明一次类型，就可以全局使用。

代码示例如下：

```typescript
// global.d.ts

import { Node } from "parse5/dist/tree-adapters/default";

declare namespace GlobalType {
  interface AstRule {
    (node: Node): boolean;
  }

  interface AstProcess {
    use(processor: AstRule): AstProcess; // use支持链式调用
    process(node: Node): Node; // process一定在最后一个，不支持链式
  }

  interface WalkerCallback {
    (node: Node): void;
  }
}

export = GlobalType;
export as namespace GlobalType;


// rules.d.ts

type AstRule = GlobalType.AstRule;
interface AstNodeEditor extends AstRule {
  (node: Node): true;
}
type AstProcess = GlobalType.AstProcess;
type WalkerCallback = GlobalType.WalkerCallback;
```

## 参考资料

### 脚手架配置

#### Typescript & Node-Env

- [Node.js脚手架开发完全指南「TypeScript版」 - 掘金 (juejin.cn)](https://juejin.cn/post/7086340583697940516)
- [搭建自己的 typescript 项目 + 开发自己的脚手架工具 ts-cli - 掘金 (juejin.cn)](https://juejin.cn/post/6901552013717438472)

- [分享快速搭建 Node 端 TypeScript 开发环境 - 掘金 (juejin.cn)](https://juejin.cn/post/6844904052816347149)
- [node-dev使用简介 - 简书 (jianshu.com)](https://www.jianshu.com/p/99d0d99b3a8a)
- [Overview | ts-node (typestrong.org)](https://typestrong.org/ts-node/docs/)
- [ts-node-dev - npm (npmjs.com)](https://www.npmjs.com/package/ts-node-dev)

#### Lint & Formatter

- [ESLint 之与 Prettier 配合使用 - 掘金 (juejin.cn)](https://juejin.cn/post/6924568874700505102#heading-2)
- [ESlint与Prettier配置指南 - 掘金 (juejin.cn)](https://juejin.cn/post/7050127881371910152)
- [一文搞懂 ESLint、Prettier 和 Typescript 配置 - 掘金 (juejin.cn)](https://juejin.cn/post/7021920332260835342)
- [VS Code下Eslint+Prettier+TypeScript一步到位（规范配置） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/432906440)

### 开发问题

- [*.d.ts导入import其它类型导致全局类型失效问题排查及解决办法 - 掘金 (juejin.cn)](https://juejin.cn/post/6981281393812701191)