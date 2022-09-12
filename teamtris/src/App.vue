<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
console.log(import.meta.env)
</script>

<template>
  <header>
    <RouterLink class='title' to="/">TEAMTRIS</RouterLink>
  </header>
  <router-view v-slot="{ Component }">
      <Transition>
        <component :is="Component" />
    </Transition>
  </router-view>

</template>

<style>
@import '@/assets/css/base.css';
@font-face {
    font-family: 'Floppy Pixel Regular';
    src: url('/src/assets/fonts/Floppy Pixel Regular');
    src: url('/src/assets/fonts/Floppy\ Pixel\ Regular.eot') format('embedded-opentype'),
         url('/src/assets/fonts/FloppyPixelRegular.woff') format('woff'),
         url('/src/assets/fonts/Floppy\ Pixel\ Regular.ttf') format('truetype'),
         url('/src/assets/fonts/Floppy\ Pixel\ Regular.svg') format('svg');
    font-weight: normal;
    font-style: normal;
   }

header {
  line-height: 1.5; 
  max-height: 100vh;
}

.title {
  display: block;
  font-family: "Floppy Pixel Regular";
  font-size: 4em;
  text-align: center;
}

a,
.green {
  text-decoration: none;
  color: hsla(160, 100%, 37%, 1);
  transition: 0.4s;
}
/* 

@media (hover: hover) {
  a:hover {
    background-color: hsla(160, 100%, 37%, 0.2);
  }
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
} */

</style>
