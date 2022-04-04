# vue-sfc-tree-shaking-issue

## The case

We have a bunch of components:

- **MyButton** (lang=ts, script setup + script)
 
  ```vue
  <script lang="ts">
  export default defineComponent({
      name: 'MyButton'
  })
  </script>

  <script setup lang="ts">
  import { ref } from 'vue'

  const counter = ref(0)
  </script>

  <template>
      <button @click="counter++">{{ counter }}</button>
  </template>
  ```

- **MyInput** (lang=ts, script setup + script)
 
  ```vue
  <script lang="ts">
  export default defineComponent({
      name: 'MyInput'
  })
  </script>


  <script setup lang="ts">
  import { ref } from 'vue'

  const model = ref('')
  </script>

  <template>
      <input v-model="model"> Hey
  </template>
  ```

- **MyModal** (script setup + script)
 
  ```vue
  <script>
  export default {
      name: "MyModal"
  }
  </script>

  <script setup>
  console.log('some side effect')
  </script>

  <template>
      <div>
          <slot />
      </div>
  </template>
  ```

- **MyAnchor** (script setup, lang=ts)

  ```vue
  <script setup lang="ts">
  const href = "hey"
  </script>

  <template>
      <a v-bind="{ href }">Hey</a>
  </template>
  ```

We have some utility:

```ts
// FILE: some-util-mod.ts

export function someUtility(): number {
    return 42
}
```

We export everything from a single entrypoint:

```ts
// FILE: exports.ts

export { default as MyButton } from './MyButton.vue'
export { default as MyInput } from './MyInput.vue'
export { default as MyModal } from './MyModal.vue'
export * from './some-util-mod'
```

Them, we want to use the utility from this entrypoint in our `main.ts` file:

```ts
// FILE: main.ts

import { someUtility } from './exports'

console.log(someUtility())
```

And **bundle** it with **tree-shaking** using `vite` & `@vitejs/plugin-vue`

### What is expected

Expected to see in the tree-shaked bundle only `someUtility()` function:

```js
function someUtility() {
  return 42;
}

console.log(someUtility());
```

### What is actually happened

Depending on some circumstances, the bundle may has some components that are not tree-shaken by some reason.

It seems that the reason is that SFC with `<script setup lang="ts">` and `<script lang="ts">` (simultaneously, like in MyButton & MyInput) **is not pure** in terms of tree-shaking.

## Reproduction

This repo has an example of 3 different entrypoints and their bundled form. Run this:

```bash
# use pnpm as package manager
npm i -g pnpm
pnpm i

# run command
pnpm go
```

You will see:

```
vite v2.9.1 building for production...
✓ 12 modules transformed.
dist/entry-1.es.js   85.64 KiB / gzip: 21.95 KiB
vite v2.9.1 building for production...
✓ 12 modules transformed.
dist/entry-2.es.js   85.64 KiB / gzip: 21.95 KiB
vite v2.9.1 building for production...
✓ 10 modules transformed.
dist/entry-3.es.js   0.07 KiB / gzip: 0.08 KiB
ℹ Audit: entry-1
  MyModal: No
  MyInput: Yes
  MyButton: Yes
  MyAnchor: No
ℹ Audit: entry-2
  MyModal: No
  MyInput: Yes
  MyButton: Yes
  MyAnchor: No
ℹ Audit: entry-3
  MyModal: No
  MyInput: No
  MyButton: No
  MyAnchor: No
```

Only 3rd entry is bundled purely.
