<template>
  <q-page padding>
    <!-- Shared Vows -->
    <div class="text-h4 sf-header text-center q-mb-sm" id="shared-vows">
      Shared Challenges<q-btn icon="add_circle" flat dense @click="addSharedVow" />
    </div>
    <progress-track
      class="q-mb-md"
      v-for="(vow, vIndex) in campaign.data.team.sharedVows"
      :key="vIndex"
      v-model="campaign.data.team.sharedVows[vIndex]"
      :show-individual-toggle="false"
    >
      <template v-slot:action v-if="config.data.edit">
        <q-btn class="col-shrink" icon="delete" flat dense @click="removeSharedVow(vIndex)" />
      </template>
    </progress-track>

    <!-- Shared Clocks -->
    <clocks class="q-mb-sm" v-model="sharedClockIds" :owner-name="'Shared'" />

    <q-separator />

    <!-- Individual Vows and Clocks -->
    <div v-for="(teammate, tIndex) in campaign.data.team.teammates" :key="tIndex">
      <q-expansion-item
        :label="teammate.callsign || teammate.name"
        expand-separator
        default-opened
        expand-icon="keyboard_arrow_down"
        expand-icon-class="q-mr-md"
      >
        <template v-slot:header>
          <div class="text-h4 sf-header q-mt-md q-mb-sm col-grow">
            <q-img v-if="teammate.image" :src="teammate.image" class="character-icon q-mr-sm" />
            {{ teammate.callsign || teammate.name }} Challenges
            <q-btn icon="add_circle" flat dense @click="addIndividualVow(tIndex)" />
          </div>
        </template>
        <progress-track
          class="q-mb-md"
          v-for="(vow, vIndex) in teammate.individualVows"
          :key="`${tIndex}-${vIndex}`"
          v-model="teammate.individualVows[vIndex]"
          :show-individual-toggle="false"
        >
          <template v-slot:action v-if="config.data.edit">
            <q-btn class="col-shrink" icon="delete" flat dense @click="removeIndividualVow(tIndex, vIndex)" />
          </template>
        </progress-track>
      </q-expansion-item>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useCampaign } from 'src/store/campaign';
import { defineComponent, ref, computed } from 'vue';

import ProgressTrack from 'src/components/Tracks/ProgressTrack.vue';
import Clocks from 'src/components/Tracks/Clocks.vue';
import { NewClock, NewProgressTrack } from 'src/lib/tracks';
import { useConfig } from 'src/store/config';

export default defineComponent({
  name: 'Challenges',
  components: { ProgressTrack, Clocks },
  setup() {
    const campaign = useCampaign();
    const config = useConfig();

    // Shared Vows
    const addSharedVow = () => campaign.data.team.sharedVows.unshift(NewProgressTrack());
    const removeSharedVow = (index: number) => campaign.data.team.sharedVows.splice(index, 1);

    // Individual Vows
    const addIndividualVow = (teammateIndex: number) => {
      campaign.data.team.teammates[teammateIndex].individualVows.unshift(NewProgressTrack());
    };
    const removeIndividualVow = (teammateIndex: number, vowIndex: number) => {
      campaign.data.team.teammates[teammateIndex].individualVows.splice(vowIndex, 1);
    };

    // Shared Clocks
    const sharedClockIds = ref(campaign.data.team.sharedClocks.map((clock) => clock.id));
    const addSharedClock = () => {
      const newClock = NewClock();
      campaign.data.team.sharedClocks.unshift(newClock);
      sharedClockIds.value.unshift(newClock.id);
    };
    const removeSharedClock = (index: number) => {
      const clockId = campaign.data.team.sharedClocks[index].id;
      campaign.data.team.sharedClocks.splice(index, 1);
      sharedClockIds.value = sharedClockIds.value.filter((id) => id !== clockId);
    };

    // Individual Clocks
    const teammateClockIds = computed(() => {
      return campaign.data.team.teammates.map((teammate) => teammate.individualClocks.map((clock) => clock.id));
    });
    const addIndividualClock = (teammateIndex: number) => {
      const newClock = NewClock();
      campaign.data.team.teammates[teammateIndex].individualClocks.unshift(newClock);
      teammateClockIds.value[teammateIndex].unshift(newClock.id);
    };
    const removeIndividualClock = (teammateIndex: number, clockIndex: number) => {
      const clockId = campaign.data.team.teammates[teammateIndex].individualClocks[clockIndex].id;
      campaign.data.team.teammates[teammateIndex].individualClocks.splice(clockIndex, 1);
      teammateClockIds.value[teammateIndex] = teammateClockIds.value[teammateIndex].filter((id) => id !== clockId);
    };

    return {
      campaign,
      config,
      addSharedVow,
      removeSharedVow,
      addIndividualVow,
      removeIndividualVow,
      addSharedClock,
      removeSharedClock,
      sharedClockIds,
      addIndividualClock,
      removeIndividualClock,
      teammateClockIds,
    };
  },
});
</script>
