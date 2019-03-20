---
title: "【Hexo】博客测试-测试文章(一)<script>"
date: 2019-03-12 14:26:27
categories: [区块链系列, SubCategory]
tags:
---

<lable>测试标签</lable>

普通文本1：Eloquent JavaScript 是一本非常好的 JavaScript 书籍。这本书很简洁，也不乏味，同时有大量的练习。以下练习改编自第 14 章，它被称为“构建表格”。

普通文本2：题目要求你用 JavaScript 构建一个 HTML 表。你的任务是依据 “mountains” 数组中的数据生成表格，将对象中的key对应到列并且每行一个对象。
      
## PHP
```php
class Test {
  private $name;
  private $age;
  public function __construct($array) {
    $this->name = $array['name'];
    $this->age = $array['age'];
  }
  
  public function getName() {
    return $this->name;
  }
  
  public function setName($name) {
    $this->name = $name;
  }
  
  public function getAge() {
    return $this->age;
  }
  
  public function show() {
    printf('my name is %s,age is %d',$this->name,$this->age);
  }
 
}
```
