<template>
  <div class="min-h-full">
    <div class="relative bg-gray-800 pb-32">
      <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="border-b border-white/10">
            <div class="flex h-16 items-center justify-between px-4 sm:px-0">
              <div class="flex items-center">
                <div class="shrink-0">
                  <svg class="h-8 w-8 text-spotify-green" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </div>
                <div class="hidden md:block">
                  <div class="ml-10 flex items-baseline space-x-4">
                    <router-link 
                      v-for="item in navigation" 
                      :key="item.name" 
                      :to="item.path" 
                      :class="[
                        isCurrentRoute(item.path) 
                          ? 'bg-gray-900 text-white' 
                          : 'text-gray-300 hover:bg-white/5 hover:text-white', 
                        'rounded-md px-3 py-2 text-sm font-medium'
                      ]"
                    >
                      {{ item.name }}
                    </router-link>
                  </div>
                </div>
              </div>
              <div class="hidden md:block">
                <div class="ml-4 flex items-center md:ml-6">
                  <!-- Profile dropdown -->
                  <Menu as="div" class="relative ml-3">
                    <MenuButton class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span class="sr-only">Open user menu</span>
                      <img 
                        v-if="user?.images?.[0]?.url" 
                        class="h-8 w-8 rounded-full" 
                        :src="user.images[0].url" 
                        alt="" 
                      />
                      <div v-else class="h-8 w-8 rounded-full bg-spotify-green flex items-center justify-center">
                        <span class="text-white font-bold">{{ user?.display_name?.charAt(0) || 'U' }}</span>
                      </div>
                    </MenuButton>
                    <transition 
                      enter-active-class="transition ease-out duration-100" 
                      enter-from-class="transform opacity-0 scale-95" 
                      enter-to-class="transform opacity-100 scale-100" 
                      leave-active-class="transition ease-in duration-75" 
                      leave-from-class="transform opacity-100 scale-100" 
                      leave-to-class="transform opacity-0 scale-95"
                    >
                      <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <MenuItem v-slot="{ active }">
                          <a 
                            href="#" 
                            @click.prevent="handleLogout" 
                            :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']"
                          >
                            Sign out
                          </a>
                        </MenuItem>
                      </MenuItems>
                    </transition>
                  </Menu>
                </div>
              </div>
              <div class="-mr-2 flex md:hidden">
                <DisclosureButton class="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span class="sr-only">Open main menu</span>
                  <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
                  <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
                </DisclosureButton>
              </div>
            </div>
          </div>
        </div>

        <DisclosurePanel class="border-b border-white/10 md:hidden">
          <div class="space-y-1 px-2 py-3 sm:px-3">
            <router-link
              v-for="item in navigation" 
              :key="item.name" 
              :to="item.path"
              :class="[
                isCurrentRoute(item.path) 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white', 
                'block rounded-md px-3 py-2 text-base font-medium w-full text-left'
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>
          <div class="border-t border-white/10 pt-4 pb-3">
            <div class="flex items-center px-5">
              <div class="shrink-0">
                <img 
                  v-if="user?.images?.[0]?.url" 
                  class="h-10 w-10 rounded-full" 
                  :src="user.images[0].url" 
                  alt="" 
                />
                <div v-else class="h-10 w-10 rounded-full bg-spotify-green flex items-center justify-center">
                  <span class="text-white font-bold">{{ user?.display_name?.charAt(0) || 'U' }}</span>
                </div>
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-white">{{ user?.display_name || 'User' }}</div>
                <div class="text-sm font-medium text-gray-400">{{ user?.email || '' }}</div>
              </div>
            </div>
            <div class="mt-3 space-y-1 px-2">
              <button
                @click="handleLogout"
                class="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
      <header class="py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold tracking-tight text-white">{{ pageTitle }}</h1>
        </div>
      </header>
    </div>

    <main class="relative -mt-32">
      <div class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'
import { spotifyAuth, spotifyAPI } from '../services/spotify'

const router = useRouter()
const route = useRoute()

const user = ref(null)

const navigation = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Year in Tunes', path: '/year' },
  { name: 'Top Charts', path: '/tops' },
  { name: 'Listening Pulse', path: '/pulse' },
  { name: 'Historical Stats', path: '/historical' },
  { name: 'Import History', path: '/import' },
  { name: 'Reports', path: '/reports' },
]

const pageTitle = computed(() => {
  const item = navigation.find(n => n.path === route.path)
  return item?.name || 'Dashboard'
})

const isCurrentRoute = (path) => {
  return route.path === path
}

const handleLogout = () => {
  spotifyAuth.logout()
  router.push('/')
}

onMounted(async () => {
  try {
    user.value = await spotifyAPI.getCurrentUser()
  } catch (error) {
    console.error('Error fetching user:', error)
  }
})
</script>


