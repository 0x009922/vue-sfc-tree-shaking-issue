# vue-sfc-tree-shaking-issue

## The case

We have a bunch of components:

- **MyButton**
 
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

- **MyInput**
 
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

- **MyModal**
 
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

We export them from a single entrypoint:

```ts
// FILE: exports.ts

export { default as MyButton } from './MyButton.vue'
export { default as MyInput } from './MyInput.vue'
export { default as MyModal } from './MyModal.vue'
```

Then, we want to import only one component from this module and use it within our main entrypoint file:

```ts
// FILE: main.ts

import { MyButton } from './exports'

console.log(MyButton)
```

Then, we **bundle** it with **tree-shaking** using `vite` & `@vitejs/plugin-vue`

### What is expected

Expected to get in the bundle only compiled MyButton and nothing about MyInput and MyModal.

### What is actually happened

Depending on some circumstances, there may be other components that are not tree-shaken by some reason.

It turned out that if component has 2 script blocks with `lang="ts"` then it is not tree-shaken:

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
```

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
✓ 10 modules transformed.
dist/entry-1.es.js   85.61 KiB / gzip: 21.94 KiB
vite v2.9.1 building for production...
✓ 10 modules transformed.
dist/entry-2.es.js   85.61 KiB / gzip: 21.94 KiB
vite v2.9.1 building for production...
✓ 7 modules transformed.
dist/entry-3.es.js   64.03 KiB / gzip: 15.80 KiB
ℹ Audit: entry-1
  MyModal: No
  MyButton: Yes
  MyInput: Yes
ℹ Audit: entry-2
  MyModal: No
  MyButton: Yes
  MyInput: Yes
ℹ Audit: entry-3
  MyModal: No
  MyButton: Yes
  MyInput: No
```

That means that:

- MyModal is tree-shaken in all entries (maybe because it is not `lang="ts"`)
- MyInput is tree-shaken only in the 3rd entry (i think because of trivial top-level tree-shaking)
