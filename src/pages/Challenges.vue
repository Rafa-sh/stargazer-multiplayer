<template>
  <q-page padding>
    <!-- Shared Vows -->
    <div class="text-h4 sf-header text-center q-mb-sm" id="shared-vows">
      Shared Vows<q-btn icon="add_circle" flat dense @click="addSharedVow" />
    </div>
    <progress-track
      class="q-mb-md"
      v-for="(vow, vIndex) in campaign.data.team.sharedVows"
      :key="vIndex"
      v-model="campaign.data.team.sharedVows[vIndex]"
    >
      <template v-slot:action v-if="config.data.edit">
        <q-btn class="col-shrink" icon="delete" flat dense @click="removeSharedVow(vIndex)" />
      </template>
    </progress-track>

    <q-separator />

    <!-- Individual Vows -->
    <div class="text-h4 sf-header text-center q-mt-md q-mb-sm" id="individual-vows">
      Individual Vows<q-btn icon="add_circle" flat dense @click="addIndividualVow" />
    </div>
    <div v-for="(teammate, tIndex) in campaign.data.team.teammates" :key="tIndex">
      <progress-track
        class="q-mb-md"
        v-for="(vow, vIndex) in teammate.individualVows"
        :key="`${tIndex}-${vIndex}`"
        v-model="teammate.individualVows[vIndex]"
      >
        <template v-slot:action v-if="config.data.edit">
          <q-btn class="col-shrink" icon="delete" flat dense @click="removeIndividualVow(tIndex, vIndex)" />
        </template>
      </progress-track>
    </div>

    <q-separator />

    <!-- Progress -->
    <div class="text-h4 sf-header text-center q-mt-md q-mb-sm" id="progress">
      Progress<q-btn icon="add_circle" flat dense @click="addTrack" />
    </div>
    <progress-track
      class="q-mb-md"
      v-for="(track, pIndex) in campaign.data.progressTracks"
      :key="pIndex"
      v-model="campaign.data.progressTracks[pIndex]"
    >
      <template v-slot:action v-if="config.data.edit">
        <q-btn class="col-shrink" icon="delete" flat dense @click="removeTrack(pIndex)" />
      </template>
    </progress-track>

    <q-separator />

    <!-- Shared Clocks -->
    <div class="text-h4 sf-header text-center q-mt-md q-mb-sm" id="shared-clocks">
      Shared Clocks<q-btn icon="add_circle" flat dense @click="addSharedClock" />
    </div>
    <clocks class="q-mb-sm" all />

    <q-separator />

    <!-- Individual Clocks -->
    <div class="text-h4 sf-header text-center q-mt-md q-mb-sm" id="individual-clocks">
      Individual Clocks<q-btn icon="add_circle" flat dense @click="addIndividualClock" />
    </div>
    <clocks
      class="q-mb-sm"
      v-for="(teammate, tIndex) in campaign.data.team.teammates"
      :key="tIndex"
      :clocks="teammate.individualClocks"
    />
  </q-page>
</template>

<script lang="ts">
import { useCampaign } from 'src/store/campaign';
import { defineComponent } from 'vue';

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
    const addIndividualVow = () => {
      campaign.data.team.teammates.forEach((teammate) => {
        teammate.individualVows.unshift(NewProgressTrack());
      });
    };
    const removeIndividualVow = (teammateIndex: number, vowIndex: number) => {
      campaign.data.team.teammates[teammateIndex].individualVows.splice(vowIndex, 1);
    };

    // Progress Tracks
    const addTrack = () => campaign.data.progressTracks.unshift(NewProgressTrack());
    const removeTrack = (index: number) => campaign.data.progressTracks.splice(index, 1);

    // Shared Clocks
    const addSharedClock = () => campaign.data.team.sharedClocks.unshift(NewClock());
    const removeSharedClock = (index: number) => campaign.data.team.sharedClocks.splice(index, 1);

    // Individual Clocks
    const addIndividualClock = () => {
      campaign.data.team.teammates.forEach((teammate) => {
        teammate.individualClocks.unshift(NewClock());
      });
    };
    const removeIndividualClock = (teammateIndex: number, clockIndex: number) => {
      campaign.data.team.teammates[teammateIndex].individualClocks.splice(clockIndex, 1);
    };

    return {
      campaign,
      config,
      addSharedVow,
      removeSharedVow,
      addIndividualVow,
      removeIndividualVow,
      addTrack,
      removeTrack,
      addSharedClock,
      removeSharedClock,
      addIndividualClock,
      removeIndividualClock,
    };
  },
});
</script>
