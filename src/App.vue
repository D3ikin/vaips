<script setup>
import AgeGate from './components/AgeGate.vue'
import TheHeader from './components/TheHeader.vue'
import HeroSection from './components/HeroSection.vue'
import ProductCatalog from './components/ProductCatalog.vue'
import TelegramCta from './components/TelegramCta.vue'
import DeliverySection from './components/DeliverySection.vue'
import FaqSection from './components/FaqSection.vue'
import TheFooter from './components/TheFooter.vue'
import CartDrawer from './components/CartDrawer.vue'
import AdminPanel from './components/AdminPanel.vue'

// /admin — панель управления, всё остальное — магазин
const isAdmin = window.location.pathname.replace(/\/+$/, '') === '/admin'
</script>

<template>
  <AdminPanel v-if="isAdmin" />
  <template v-else>
    <AgeGate />
    <TheHeader />
    <main>
      <HeroSection />
      <ProductCatalog />
      <TelegramCta />
      <DeliverySection />
      <FaqSection />
    </main>
    <TheFooter />
    <CartDrawer />
  </template>
</template>
