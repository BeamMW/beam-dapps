<template>
  <gallery></gallery>
</template>

<script>
// @ is an alias to /src
import Gallery from '@/components/Gallery.vue';

export default {
  name: 'Home',
  components: {
    gallery: Gallery,
  },
};
</script>
