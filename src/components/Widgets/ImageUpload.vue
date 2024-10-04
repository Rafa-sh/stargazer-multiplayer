<template>
  <div class="image-upload-container">
    <div v-if="!imageUrl" class="image-upload-box" @click="triggerUpload">
      <q-icon name="add_photo_alternate" size="40px" color="rgba(0, 123, 255, 0.7)" />
      <div class="upload-text">Upload Image</div>
      <input type="file" ref="fileInput" accept="image/*" @change="onFileSelected" class="hidden-file-input" />
    </div>
    <div v-else class="image-display-container">
      <q-img :src="imageUrl" class="character-image" />
      <q-btn icon="add" flat dense class="reupload-button" @click="triggerUpload" />
      <input type="file" ref="fileInput" accept="image/*" @change="onFileSelected" class="hidden-file-input" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ImageUpload',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const imageUrl = ref(props.modelValue);
    const fileInput = ref<HTMLInputElement | null>(null);

    const onFileAdded = (files: File[]) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          imageUrl.value = e.target.result as string;
          emit('update:modelValue', e.target.result as string);
        }
      };
      reader.readAsDataURL(files[0]);
    };

    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    const onFileSelected = (event: Event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        onFileAdded(Array.from(files));
      }
    };

    return {
      imageUrl,
      fileInput,
      onFileAdded,
      triggerUpload,
      onFileSelected,
    };
  },
});
</script>

<style scoped>
.image-upload-container {
  position: relative;
  display: inline-block;
}

.image-upload-box {
  width: 150px;
  height: 150px;
  border: 2px dashed var(--q-primary); /* Blueish-transparent border */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5); /* Slightly transparent background */
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.image-upload-box:hover {
  background-color: rgba(255, 255, 255, 0.7); /* Slightly more opaque on hover */
}

.upload-text {
  margin-top: 8px;
  color: var(--q-primary); /* Blueish-transparent text */
  font-size: 14px;
  text-align: center;
}

.image-display-container {
  position: relative;
  width: 100px;
  height: 100px;
}

.character-image {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

.reupload-button {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background-color: var(--q-primary); /* Semi-transparent blueish background */
  color: white; /* White icon color */
  border-radius: 8px; /* More square-ish */
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.hidden-file-input {
  display: none;
}
</style>
