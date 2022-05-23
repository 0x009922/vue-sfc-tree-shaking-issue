# vue-sfc-tree-shaking-issue

The problem is that when you bundle a component with `lang=ts` and 2 `<script>` blocks (`setup` + plain), then such a component is unable to be tree-shaken.

## Repro

```bash
pnpm i
pnpm build
```

### Expected

Expected to open `dist/output.es.js` and see something like:

```js
function someUtility() {
  return 42;
}

console.log(someUtility());
```

### Actual

`dist/output.es.js` contains the whole `vue` package, a component `SampleComponent` and only in the end the desired code.

## Additional details

- When you remove `lang=ts`, as it is done in `SampleComponentJs.vue`, then tree shaking works. Try change import in `src/lib/index.ts` and see the result.
- Even when `lang=js` is used, the bundled code has a dirt:
  
  ```js
  defineComponent({
      name: 'SampleComponentJs'
  });

  function someUtility() {
    return 42;
  }

  console.log(someUtility());
  ```
