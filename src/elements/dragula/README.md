# Setup

You'll need to add `DragulaService` to your components `providers` and also add `Dragula` to your components `directives`.

```js
@Component({
  selector: 'sample',
  directives: [Dragula],
  providers: [DragulaService],
  template:`
  <div>
    <div class='wrapper'>
      <div class='container' [dragula]='"first-bag"'>
        <div>You can move these elements between these two containers</div>
        <div>Moving them anywhere else isn't quite possible</div>
        <div>There's also the possibility of moving elements around in the same container, changing their position</div>
      </div>
      <div class='container' [dragula]='"first-bag"'>
        <div>This is the default use case. You only need to specify the containers you want to use</div>
        <div>More interactive use cases lie ahead</div>
        <div>Make sure to check out the <a href='https://github.com/bevacqua/dragula#readme'>documentation on GitHub!</a></div>
      </div>
    </div>
  </div>
  `
})
class Sample {}
```

# Usage

This package isn't very different from `dragula` itself. I'll mark the differences here, but please refer to the documentation for [`dragula`](https://github.com/bevacqua/dragula) if you need to learn more about `dragula` itself.

## Directive

There's a `dragula` directive that allows you to group containers together. That grouping of containers is called a `bag`.

```html
<div [dragula]='"bag-one"'></div>
<div [dragula]='"bag-one"'></div>
<div [dragula]='"bag-two"'></div>
```

### `dragulaModel`

If your `ngFor` is compiled from array, you may wish to have it synced. For that purpose you need to provide model by setting the `dragulaModel` attribute on the bag element.

```html
<ul>
  <li *ngFor="let item of items" [dragula]='"bag-one"' [dragulaModel]='items'></li>
</ul>
```

The standard `drop` event is fired before the model is synced. For that purpose you need to use the `dropModel`. The same behavior exists in the `remove` event. Therefore is the `removeModel` event. Further details are available under `Events`

### `drake` options

If you need to configure the `drake` _(there's only one `drake` per `bag`)_, you can use the `DragulaService`.

```js
class ConfigExample {
  constructor(dragulaService: DragulaService) {
    dragulaService.setOptions('third-bag', {
      removeOnSpill: true
    });
  }
}
```

## Events

Whenever a `drake` instance is created with the `dragula` directive, there are several events you can subscribe to via `DragulaService`. Each event emits an `Array` where the first item is the name of the bag. The remaining items depend on the event. The sample below illustrates how you can use destructuring to assign the values from the event. Refer to: https://github.com/bevacqua/dragula#drakeon-events

```html
<div [dragula]='"evented-bag"'></div>
```

```js
export class EventExample {

  constructor(dragulaService: DragulaService) {
    dragulaService.drag.subscribe((value) => {
      console.log(`drag: ${value[0]}`);
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      (`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
    });
    dragulaService.over.subscribe((value) => {
      console.log(`over: ${value[0]}`);
      this.onOver(value.slice(1));
    });
    dragulaService.out.subscribe((value) => {
      console.log(`out: ${value[0]}`);
      this.onOut(value.slice(1));
    });
  }

  onDrag(args) {
    let [e, el] = args;
    // do something
  }

  onDrop(args) {
    let [e, el] = args;
    // do something
  }

  onOver(args) {
    let [e, el, container] = args;
    // do something
  }

  onOut(args) {
    let [e, el, container] = args;
    // do something
  }
}
```

## Special Events for ng2-dragula

| Event Name |      Listener Arguments      |  Event Description |
| :-------------: |:-------------:| -----|
| dropModel | bagName, el, target, source | same as normal drop, but model was synced, just available with the use of dragulaModel |
| removeModel | bagName, el, container | same as normal remove, but model was synced, just available with the use of dragulaModel |

## `DragulaService`

This service exposes a few different methods with which you can interact with `dragula`.

### `dragulaService.add(name, drake)`

Creates a `bag` identified by `name`. You should provide the entire `drake` instance. Typically, the directive takes care of this step.

### `dragulaService.setOptions(name, options)`

Sets the `options` used to instantiate a `drake`. Refer to the documentation for [`dragula`](https://github.com/bevacqua/dragula#readme) to learn more about the `options` themselves.

### `dragulaService.find(name)`

Returns the `bag` for a `drake` instance. Contains the following properties.

- `name` is the name that identifies the bag under `scope`
- `drake` is the raw `drake` instance itself

### `dragulaService.destroy(name)`

Destroys a `drake` instance named `name`.

# Contributing

Please see the [CONTRIBUTING](https://github.com/valor-software/ng2-dragula/blob/master/CONTRIBUTING.md) file for guidelines.

# License

MIT

# Awesome thank you's

Project setup is based on the excellent [angular2-seed](https://github.com/mgechev/angular2-seed) by [Minko Gechev](https://github.com/mgechev).
