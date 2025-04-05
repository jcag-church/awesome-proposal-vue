<script setup lang="ts">
import { fillForm, saveForm } from './pdf-service';

const handleClick = async () => {
  const fields = {
    name: 'Justine',
    ministry: 'Worship Ministry',
    objective: 'Magpayaman',
    participants: '150',
    venue: 'Worship Hall',
    event_date: 'May 13, 2024',
    needBudget: true,
    budget: '100,000',
    overseer: 'Me'
  }
  const form = await fillForm(fields)
  console.log(form)
  const date = new Date()
  const dateToday = `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDay()}`
  const fileName = `${fields.ministry}_${fields.name}_${dateToday}`.toLowerCase()
  saveForm(form, fileName);
}
</script>

<template>
  <Button v-on:click="handleClick">Get Form Fields</Button>
</template>

<style scoped></style>
