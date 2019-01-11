[toc]

# flex布局

## 文档
[A Complete Guide to FlexBox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

[Flex布局教程-阮一峰](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

## 基本概念
Flex是Flexible Box的缩写，意为“弹性布局”，用于取代传统的盒子模型(display+position+float)，使布局更简单方便，例如在盒子模型下“垂直居中”不容易实现。

浏览器支持版本：IE10+, Chrome21+, FireFox22+, Safari6.1+

任何容器都可以指定为flex布局
```css
.box {display: flex;}
.box {display: inline-flex;} /*行内容器*/
```

设置flex的包裹元素称为`container`，其子元素称为`item`。container存在两根轴线: 主轴(main axis)和交叉轴(cross axis)。

主轴起点为`main start`, 终点为`main end`。交叉轴起点为`cross start`, 终点为`cross end`。

item占主轴空间为`main size`, 占交叉轴空间为`cross size`。

## container属性
### flex-direction
该属性定义主轴方向(item排列方向)，有4个值：
- row: 默认值，水平方向，起点在左端。
- row-reverse: 水平方向，起点在右端。
- column: 垂直方向，起点在上端。
- column-reverse: 垂直方向，起点在下端。

### flex-wrap
该属性定义item在主轴排列不下时的换行方式，有3个值：
- nowrap: 默认，不换行。
- wrap: 换行，新行在下面。
- wrap-reverse: 换行，新行在上面。

### flex-flow
该属性为`flex-direction || flex-wrap`的组合，默认`row nowrap`。

### justify-content
该属性定义item在主轴上的对齐方式，有5个值(假设主轴从左向右):
- flex-start: 默认值，左对齐。
- flex-end: 右对齐。
- center: 居中对齐。
- space-between: 两端对齐(间隔相等)。
- space-around: 两端对齐(中间间隔是两端间隔的两倍)。

### align-items
该属性定义item在交叉轴上的对齐方式，有5个值(假设交叉轴从上到下):
- flex-start: item在上端对齐。
- flex-end: item在下端对齐。
- center: item在中间对齐。
- baseline: item的文本基线对齐。
- stretch: 默认值，item撑满container的高度。

### align-content
该属性定义了多根轴线的对齐方式，如果只有一根轴线该属性不生效，多用于主轴有换行或多个轴，有6个值(假设交叉轴从上到下):
- flex-start: 第一行item在上端对齐。
- flex-end: 最后一行item在下端对齐。
- center: 中间行item在中间对齐。
- space-between: items在上下两端对齐，主轴方向间隔分布。
- space-around: items在上下两端对齐，主轴方向间隔分布(中间间隔是两端间隔的两倍)。
- stretch: 默认值，交叉轴方向撑满容器。

## item属性
### order
该属性定义item的排序，越小越前，默认`0`。

### flex-grow
该属性定义item的放大权重，默认`0`不放大，如果容器主轴方向在有剩余空间，items将按该属性定义的权重分割剩余空间。

### flex-shrink
该属性定义item的缩小权重，默认`1`，如果容器在主轴方向空间不足时，items将按该属性定义的权重缩小。

### flex-basis
该属性定义了容器在计算空间前，该item占容器的初始空间(main-size)，格式：`<length> | auto`，默认`auto`即原始值，length与width/height属性设置方式一样。

### flex
该属性是`flex-grow || flex-shrink || flex-basis`的组合，默认`0 1 auto`。

### align-self
该属性在item上覆盖container的`align-items`属性，用于单个item上设置与其余item不一样的对齐方式，属性值同容器的`align-items`。

## 使用示例
两个子元素分布于容器的两端
```html
<div style={{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
}}>
    <span>标题</span>
    <span>导出</div>
</div>
```