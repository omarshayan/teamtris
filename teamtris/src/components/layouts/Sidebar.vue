<template>
  <SidebarMenu :menu="menu" />
</template>

<script>
import { SidebarMenu } from 'vue-sidebar-menu'
// import { AuthenticationButton } from '@/components/elements/authentication-button.vue'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
  export default {
    components: {
      SidebarMenu
    },
    data() {
      return {
        menu: [
          {
            header: 'Main Navigation',
            hiddenOnCollapse: true
          },
          {
            href: '/',
            title: 'Dashboard',
            icon: 'fa fa-user'
          },
          {
            href: '/charts',
            title: 'Charts',
            icon: 'fa fa-chart-area',
            child: [
              {
                href: '/charts/sublink',
                title: 'Sub Link'
              }
            ]
          }
        ]
      }
    }
  }
</script>