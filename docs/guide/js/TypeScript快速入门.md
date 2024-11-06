# TypeScript基本知识

## 1、TypeScript常用类型

##### 1、原始类型`number/string/boolean/null/undefined/symbol`

```typescript
let age: number = 12
let stuName: string = '张三';
let isVip: boolean = true;
let iv: null = null;
let isUndefined: undefined = undefined
const symbol: symbol = Symbol(123)
```

##### 2、数组类型

```typescript
//方式一
let strings: string[] = ['12', '34']
//方式二
let stringArr: Array<string> = ['12', 'ser']
```

##### 3、联合类型

当一个数组需要允许多个类型同时存在的话可以使用联合类型

```typescript
//方式一
let numbers: (string | number)[] = [1, '32']
//方式二、缺点：任意类型都可以存放
let anyArr: any = [1, 2, '34', false]
```

##### 4、函数类型

```typescript
//方式一：单独指定参数、返回值的类型
function add(num1: number, num2: number): number {
    return num2 + num1
}

//方式二：同时指定参数、返回值的类型
const addTwo: (num1: number, num2: number) => number = (num1, num2) => {
    return num2 + num1
}
```

`第一种的阅读性强一点，推荐使用方式一`

```typescript
//返回类型为空可以使用void修饰，也可以不写，通过类型推断可以得出
function sayHello(name: string): void {
    console.log(`你好，${name}`)
}
```

##### 5、可选符号

`在可传可不传的参数名称后面添加 ?（问号）`

使用场景

1、对象属性可选

```typescript
//在这种情况下name和age可以不给值，但是sex必须给值，否则会报错
const person: { name?: string, age?: number, sex: string } = {
    name: '张三',
    age: 12,
    sex: '男'
}

```

2、函数的可选参数

```typescript
let anyArr: any = [1, 2, '34', false]
anyArr.slice(1)
anyArr.slice(1,3)
```

##### 6、接口

当一个对象类型被多次使用时，一般会使用接口（interface）来描述对象的类型，达到复用的目的。

**示例**

```typescript
interface IPerson {
    name: string
    age: number
    sex: string
}

const student: IPerson = {
    name: '王五',
    sex: '男',
    age: 12
}
```

##### 7、类型别名和接口对比

interface（接口）和 type（类型别名）的对比： 

 **相同点：**

- 都可以给对象指定类型。

 **不同点：** 

-  接口，只能为对象指定类型。
-  类型别名，不仅可以为对象指定类型，实际上可以为任意类型指定别名

##### 8、继承

如果两个接口之间有相同的属性或方法，可以将公共的属性或方法抽离出来，通过继承来实现复用。

**示例**

```typescript
interface Person {
    name: string
    age: number
    sex: string
}

//因为学生也具有人类的属性，并且还有独特的属性，如（学号，班级...）
interface Student extends Person {
    stuNum: string
    className: string
}

const student: Student = {
    name: '张三',
    age: 12,
    sex: '男',
    stuNum: '20221103',
    className: '六年级一班',
}
```

##### 9、元组

**场景**：

在地图中，使用经纬度坐标来标记位置信息(个数不限)

```typescript
let tuple: [number, number] = [12, 2]
```

##### 10、 **类型断言**

使用`as`关键字，使用场景多态，父类对象转子类对象

```typescript
interface Person {
    name: string
    age: number
    sex: string
}

//因为学生也具有人类的属性，并且还有独特的属性，如（学号，班级...）
interface Student extends Person {
    stuNum: string
    className: string
}

const student: Student = {
    name: '张三',
    age: 12,
    sex: '男',
    stuNum: '20221103',
    className: '六年级一班',
}
const person: Person = student as Person;
```

##### 11、字面量类型

**使用场景**
			限制死了只有某几种类型时

```typescript
function changeDirection(direction: 'UP' | 'DOWN' | "LEFT" | 'RIGHT') {
    console.log(`往${direction}移动了`)
}
```

##### 12、枚举

```typescript
//如果没有手动赋值，则默认值为数字类型，从0开始递增，如果设置第一个值为数字，那么自增从这个值上自增
//如果为string类型，必须给初始值
enum Direction {
    UP = 'UP',
    DOWN = 'DOWN',
    LEFT = "LEFT",
    RIGHT = 'RIGHT'
}

function changeDirectionEnum(direction: Direction) {
    console.log(`往${direction}移动了`)
}

changeDirectionEnum(Direction.UP)
```

##### 13、**any 类型**

原则：**不推荐使用 any**！这会让 TypeScript 变为 “AnyScript”（失去 TS 类型保护的优势）。

因为当值的类型为 any 时，可以对该值进行任意操作，并且不会有代码提示

##### 14、typeOf

一般用于:（冒号）后面

```typescript
let p = {x: 1, y: 2, z: 3}
let px = {x: 1, y: 2}
//此处的含义为：传入的对象必须满足含有x,y,z三个属性，少一个就会报错
function formatPoint(point: typeof p) {
    console.log(point)
}

formatPoint(px)
```

## 2、TypeScript高级

##### 1、class

```typescript
class Person {
    name: string
    age: number
}

//构造函数 constructor，用于对象初始化时赋值
//默认构造函数的参数为any类型
class Person {
    name: string
    age: number

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

let per = new Person('张三', 13);
console.log(per)
```

类继承的两种方式：1 extends（继承父类） 2 implements（实现接口）

##### 2、**交叉类型**

交叉类型（&）：功能类似于接口继承（extends），用于组合多个类型为一个类型（**常用于对象类型**）。

```typescript
interface Man {
    name: string
}

interface Contact {
    phone: string
}

type PersonDetail = Man & Contact
//等同于type PersonDetail = { name: string, phone: string }
const per: PersonDetail = {
    name:'张三',
    phone:'15575848845'
}
```

##### 3、交叉类型和继承对比

交叉类型（&）和接口继承（extends）的对比： 

 **相同点：**

- 都可以实现对象类型的组合。

 **不同点：**

- 两种方式实现类型组合时，对于同名属性之间，处理类型冲突的方式不同。

  **1、接口继承**

```typescript
interface A {
    f(val: string): void
}
//这样集成会报错
interface B extends A {
    f(val: number): void
}
```

**2、交叉类型**

```typescript
interface A {
    f(val: string): void
}

interface B {
    f(val: number): void
}

type AbDetail = A & B;
//f(val:number|string)
const abDetail: AbDetail = {
    f(val) {
        console.log(typeof val)
    }
}
abDetail.f(1)
abDetail.f('234')
```

##### 4、泛型

泛型是可以在保证类型安全前提下，让函数等与多种类型一起工作，从而实现复用，常用于：函数、接口、class 中。

需求：创建一个 id 函数，传入什么数据就返回该数据本身（也就是说，参数和返回值类型相同）。

比如，id(10) 调用以上函数就会直接返回 10 本身。但是，该函数只接收数值类型，无法用于其他类型。

为了能让函数能够接受任意类型，可以将参数类型修改为 any。但是，这样就失去了 TS 的类型保护，类型不安全。

**泛型**在**保证类型安全**（不丢失类型信息）的同时，可以**让函数等与多种不同的类型一起工作**，灵活可**复用**。

实际上，在 C＃和 Java 等编程语言中，泛型都是用来实现可复用组件功能的主要工具之一。

```typescript
function id<Type>(val: Type): Type {
    return val
}
```

解释：

- 语法：在函数名称的后面添加 <>（尖括号），尖括号中添加类型变量，比如此处的 Type。
- 类型变量 Type，是一种特殊类型的变量，它处理类型而不是值。
- 该类型变量相当于一个类型容器，能够捕获用户提供的类型（具体是什么类型由用户调用该函数时指定）。
- 因为 Type 是类型，因此可以将其作为函数参数和返回值的类型，表示参数和返回值具有相同的类型。
- 类型变量 Type，可以是任意合法的变量名称。

**解释：**

- Type 可以代表任意类型，无法保证一定存在 length 属性，比如 number 类型就没有 length。
- 此时，就需要为泛型添加约束来**收缩类型**（缩窄类型取值范围）。

##### 5、泛型约束收缩类型

主要有以下两种方式：

- 指定更加具体的类型 

  将类型修改为 Type[]（Type 类型的数组），因为只要是数组就一定存在 length 属性，因此就可以访问了。

  ```typescript
  function len<Type>(val: Type[]): Type[] {
      console.log(val.length)
      return val
  }
  ```

- 添加约束

```typescript
interface ILength {
    length: number
}

function lens<Type extends ILength>(val: Type): Type {
    console.log(val.length)
    return val
}
```

**解释**：

- 创建描述约束的接口 ILength，该接口要求提供 length 属性。
- 通过 extends 关键字使用该接口，为泛型（类型变量）添加约束。
- 该约束表示：传入的类型必须具有 length 属性。 
- 注意：传入的实参（比如，数组）只要有 length 属性即可，这也符合前面讲到的接口的类型兼容性。



##### 6、泛型多个<T,R>

```typescript
class Person {
    name: string
    age: number

    constructor(name: string, age: number) {
        this.name = name
        this.age = age
    }
}
function getProp<Type, Key extends keyof Type>(obj: Type, key: Key) {
    return obj[key]
}
let per = new Person("史玉波", 12)
console.log(getProp(per, 'name')); //史玉波
console.log(getProp(per, 'age')); //12
```

**解释：**

- 添加了第二个类型变量 Key，两个类型变量之间使用（
- 逗号分隔。
- keyof 关键字接收一个对象类型，生成其键名称（可能是字符串或数字）的联合类型。
- 本示例中 keyof Type 实际上获取的是 person 对象所有键的联合类型，也就是：'name' | 'age'。
- 类型变量 Key 受 Type 约束，可以理解为：Key 只能是 Type 所有键中的任意一个，或者说只能访问对象中存在的属性

##### 7、泛型接口

```typescript
interface IdFunc<T> {
    id(): T
    ids(): T[]
}

const ab: IdFunc<string> = {
    ids(): string[] {
        return ['1', '2', '3'];
    },
    id(): string {
        return "12";
    }
}
```

##### 8、泛型工具类

1. `Partial<Type> `

   用来构造（创建）一个类型，将 Type 的所有属性设置为可选

2. `Readonly<Type>`

   用来构造一个类型，将 Type 的所有属性都设置为 readonly（只读）。

3. `Pick<Type, Keys>`

   从 Type 中选择一组属性来构造新类型。

4. `Record<Keys, Type>`

   构造一个对象类型，属性键为 Keys，属性类型为 Type

**Partial**

```typescript
class Animal<T> {
    sex: T
    phone: T
    name: T

    constructor(sex: T, phone: T, name: T) {
        this.sex = sex
        this.phone = phone
        this.name = name
    }
}

type  AnimalDetail=Partial<Animal<string>>
//{sex?: string, phone?: string, name?: string}
let animal:AnimalDetail = new Animal<string>('男','155','张三');
```

**Readonly**

```typescript
class Animal<T> {
    sex: T
    phone: T
    name: T

    constructor(sex: T, phone: T, name: T) {
        this.sex = sex
        this.phone = phone
        this.name = name
    }
}

type  animalReadonly=Readonly<Animal<string>>
//{readonly sex: string, readonly phone: string, readonly name: string}
```

**Pick**

```typescript
class Animal<T> {
    sex: T
    phone: T
    name: T

    constructor(sex: T, phone: T, name: T) {
        this.sex = sex
        this.phone = phone
        this.name = name
    }
}

type  adnimalPick = Pick<Animal<string>, 'sex' | 'name'>
//{sex: string, name: string}
```

**Record**

```typescript
class Animal<T> {
    sex: T
    phone: T
    name: T

    constructor(sex: T, phone: T, name: T) {
        this.sex = sex
        this.phone = phone
        this.name = name
    }
}

type animalRecord = Record<'a' | 'b' | 'c', string[]>
//{a: string[], b: string[], c: string[]}
```

##### 9、**索引签名类型**

使用场景：当无法确定对象中有哪些属性（或者说对象中可以出现任意多个属性），此时，就用到索引签名类型了

1、

```typescript
interface AnyObject {
    [key: string]: number
}

const anyObject: AnyObject = {
    a:1,
    b:2,
    1:2
}
```

2、js数组原理

```typescript
interface MyArr<T> {
    [n: number]: T
}

const arr: MyArr<string> = ['1', '2']
```

##### 10、**映射类型**

```typescript
//方式一：联合类型
type   Picks = 'a' | 'b' | 'c'
type Types = { [Key in Picks ]:number}
//{a: number, b: number, c: number}

//方式二：对象类型
interface Properties {
    name: string;
    age: number;
    ate: () => void;
    likeColors: string[];
}

type preo = { [Key in keyof Properties]: number }
//{name: number, age: number, ate: number, likeColors: number}
```