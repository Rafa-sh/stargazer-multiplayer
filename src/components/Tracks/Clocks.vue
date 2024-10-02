<template>
  <div>
    <div
      class="row q-gutter-sm q-mb-sm items-center justify-center"
      v-if="all && campaign.data.team.sharedClocks.length > 0"
    >
      <q-btn label="Begin a Session" flat dense @click="rollAllClocks" />
    </div>

    <div class="row q-gutter-sm q-mb-sm items-center">
      <q-toggle v-model="isIndividual" label="Individual Clocks" @update:modelValue="updateClockType" />
      <q-select
        v-if="isIndividual"
        class="col"
        label="Teammate"
        v-model="selectedTeammate"
        :options="teammateOptions"
        dense
        emit-value
        map-options
        @update:modelValue="updateTeammate"
      />
    </div>

    <div class="row q-gutter-sm q-mb-sm items-center" v-if="!all">
      <q-select class="col" label="Clock" v-model="clockSelect" :options="clockOpts" dense emit-value map-options />
      <q-btn class="col-shrink" icon="remove_circle" flat dense @click="unlinkClock(clockSelect)" />
      <q-btn class="col-shrink" icon="add_circle" flat dense @click="addClock(clockSelect)" />
    </div>

    <div class="row q-gutter-sm justify-evenly" v-if="!all">
      <clock v-for="index in clockIndices" :key="index" v-model="clocks[index]" @delete="removeClock(index)" />
    </div>

    <div class="row q-gutter-sm justify-evenly" v-else>
      <clock v-for="(clock, index) in clocks" :key="index" v-model="clocks[index]" @delete="removeClock(index)" />
    </div>
  </div>
</template>

<script lang="ts">
import { NewClock, RollClock } from 'src/lib/tracks';
import { useCampaign } from 'src/store/campaign';
import { defineComponent, PropType, ref, computed, watch } from 'vue';
import { EAtO, ISelectOpt, IClock, ITeammate } from '../models';

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
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const idList = computed({
      get() {
        return props.modelValue;
      },
      set(value: string[]) {
        emit('update:modelValue', value);
      },
    });

    const campaign = useCampaign();
    const clockSelect = ref('');
    const isIndividual = ref(false);
    const selectedTeammate = ref<ITeammate | null>(null);

    watch(
      () => props.modelValue,
      () => {
        if (!isIndividual.value) {
          selectedTeammate.value = null;
        }
      },
      { deep: true }
    );

    const clocks = computed(() => {
      if (isIndividual.value && selectedTeammate.value) {
        return selectedTeammate.value.individualClocks;
      }
      return campaign.data.team.sharedClocks;
    });

    const clockIndices = computed(() => {
      const out: number[] = [];
      if (!idList.value) return out;
      idList.value.forEach((id) => {
        clocks.value.forEach((c, i) => {
          if (c.id === id) {
            out.push(i);
          }
        });
      });
      return out;
    });

    const clockOpts = computed(() => {
      const out: ISelectOpt[] = [{ label: 'New', value: 'new' }];
      clocks.value.forEach((c) => {
        out.push({
          label: c.name,
          value: c.id,
        });
      });
      return out;
    });

    const addClock = (id: string) => {
      if (id === 'new') {
        const c = NewClock();
        clocks.value.unshift(c);
        idList.value.unshift(c.id);
        return;
      }
      idList.value.unshift(id);
    };

    const unlinkClock = (id: string) => {
      idList.value.forEach((c, i) => {
        if (c === id) idList.value.splice(i, 1);
      });
    };

    const removeClock = (index: number) => {
      clocks.value.splice(index, 1);
    };

    const rollAllClocks = () => {
      clocks.value.forEach((clock, index) => {
        if (clock.advance !== EAtO.NoRoll) {
          clocks.value[index] = RollClock(clock);
        }
      });
    };

    const teammateOptions = computed(() => campaign.data.team.teammates.map((t) => ({ label: t.name, value: t })));

    const updateClockType = (value: boolean) => {
      isIndividual.value = value;
      if (!value) {
        selectedTeammate.value = null;
      }
    };

    const updateTeammate = (value: ITeammate) => {
      selectedTeammate.value = value;
    };

    return {
      addClock,
      unlinkClock,
      removeClock,
      clockIndices,
      clockOpts,
      clockSelect,
      rollAllClocks,
      campaign,
      isIndividual,
      selectedTeammate,
      teammateOptions,
      updateClockType,
      updateTeammate,
      clocks,
    };
  },
});
</script>
