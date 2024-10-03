<template>
  <div>
    <div class="row q-gutter-sm q-mb-sm items-center justify-center" v-if="all && clocks.length > 0">
      <q-btn label="Begin a Session" flat dense @click="rollAllClocks" />
    </div>

    <div class="row q-gutter-sm q-mb-sm items-center justify-center">
      <q-btn
        class="col-shrink"
        :label="`ADD ${isShared ? 'SHARED' : ownerName.toUpperCase()} CLOCK`"
        flat
        dense
        @click="addClock"
      >
        <q-icon name="add_circle" class="q-ml-sm" />
      </q-btn>
    </div>

    <div class="row q-gutter-sm justify-evenly" v-if="!all">
      <clock
        v-for="index in clockIndices"
        :key="index"
        :modelValue="clocks[index]"
        @update:modelValue="updateClock(index, $event)"
        @delete="removeClock(index)"
      />
    </div>

    <div class="row q-gutter-sm justify-evenly" v-else>
      <clock
        v-for="(clock, index) in clocks"
        :key="index"
        :modelValue="clock"
        @update:modelValue="updateClock(index, $event)"
        @delete="removeClock(index)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { NewClock, RollClock } from 'src/lib/tracks';
import { useCampaign } from 'src/store/campaign';
import { defineComponent, PropType, computed, watch } from 'vue';
import { EAtO, IClock } from '../models';

import Clock from 'src/components/Tracks/Clock.vue';

export default defineComponent({
  name: 'Clocks',
  components: { Clock },
  props: {
    all: {
      type: Boolean,
    },
    modelValue: {
      type: Array as PropType<string[]>,
      default: () => {
        return [];
      },
    },
    ownerName: {
      type: String,
      default: 'Team',
    },
    isShared: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const campaign = useCampaign();

    const clocks = computed(() => {
      if (props.isShared) {
        return campaign.data.team.sharedClocks;
      } else {
        const teammate = campaign.data.team.teammates.find((t) => t.name === props.ownerName);
        return teammate ? teammate.individualClocks : [];
      }
    });

    const clockIndices = computed(() => {
      const out: number[] = [];
      if (!props.modelValue) return out;
      props.modelValue.forEach((id) => {
        clocks.value.forEach((c, i) => {
          if (c.id === id) {
            out.push(i);
          }
        });
      });
      return out;
    });

    watch(
      () => props.modelValue,
      (newValue) => {
        emit('update:modelValue', newValue);
      },
      { deep: true }
    );

    const addClock = () => {
      const c = NewClock();
      clocks.value.unshift(c);
      emit('update:modelValue', [c.id, ...props.modelValue]);
    };

    const unlinkClock = (id: string) => {
      const newValue = props.modelValue.filter((c) => c !== id);
      emit('update:modelValue', newValue);
    };

    const removeClock = (index: number) => {
      const clockId = clocks.value[index].id;
      clocks.value.splice(index, 1);
      unlinkClock(clockId);
    };

    const rollAllClocks = () => {
      clocks.value.forEach((clock, index) => {
        if (clock.advance !== EAtO.NoRoll) {
          clocks.value[index] = RollClock(clock);
        }
      });
    };

    const updateClock = (index: number, newClock: IClock) => {
      clocks.value[index] = newClock;
    };

    return {
      addClock,
      unlinkClock,
      removeClock,
      clockIndices,
      rollAllClocks,
      campaign,
      clocks,
      updateClock,
    };
  },
});
</script>
