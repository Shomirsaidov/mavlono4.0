<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo/40 backdrop-blur-sm">
        <div class="relative w-full glass-card rounded-[2rem] p-8 md:p-10 overflow-hidden" :class="maxWidthClass">
          <!-- Close Button -->
          <button @click="close" class="absolute top-6 right-6 p-2 rounded-full bg-surface-2 text-text-muted hover:text-indigo hover:bg-indigo-light transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>

          <!-- Header -->
          <div v-if="$slots.header" class="mb-6">
            <slot name="header" />
          </div>

          <!-- Content -->
          <div class="max-h-[70vh] overflow-y-auto no-scrollbar">
            <slot />
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-border">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  maxWidth: {
    type: String,
    default: '2xl'
  }
})

const emit = defineEmits(['update:modelValue'])

const maxWidthClass = computed(() => {
  return {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }[props.maxWidth] || 'max-w-2xl'
})

const close = () => emit('update:modelValue', false)

// Prevent scroll when open
watch(() => props.modelValue, (val) => {
  if (val) document.body.style.overflow = 'hidden'
  else document.body.style.overflow = ''
})
</script>
