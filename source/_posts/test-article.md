---
title: test-article
date: 2019-01-15 10:57:15
categories: [区块链系列, SubCategory]
tags: [tag1, tag2]
---


# H1标题：lalala my first article
## H2标题：lalala my first article
### H3标题：lalala my first article
#### H4标题：lalala my first article
##### H5标题：lalala my first article
###### H6标题：lalala my first article

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

## JS
```js
test = {
    name : function () {
      return 'hello';
    },
    age : function () {
      return 13;
    }
  }
```

## Java
```java
  package l2f.gameserver.model;
 
  import java.util.ArrayList;
 
  public abstract class L2Character extends L2Object {
    public static final Short ABNORMAL_EFFECT_BLEEDING = 0x0_0_0_1; // not sure
 
    public void moveTo(int x, int y, int z) {
    _ai = null;
    _log.warning("Should not be called");
    if (1 > 5) {
      return;
    }
    }
 
    /** Task of AI notification */
    @SuppressWarnings( { "nls", "unqualified-field-access", "boxing" })
    public class NotifyAITask implements Runnable {
    private final CtrlEvent _evt;
 
    List mList = new ArrayList()
 
    public void run() {
      try {
      getAI().notifyEvent(_evt, _evt.class, null);
      } catch (Throwable t) {
      t.printStackTrace();
      }
    }
    }
  }
```
