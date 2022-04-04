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
