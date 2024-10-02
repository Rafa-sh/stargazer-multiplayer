<template>
  <q-page padding>
    <!-- Team Information -->
    <div class="text-h4 sf-header text-center q-mb-sm" id="team-info">Team Information</div>
    <div class="row full-width items-center" id="top">
      <q-input class="col-grow" label="Team Name" v-model="campaign.data.team.name" dense />
      <q-input class="col-4" label="Location" v-model="campaign.data.team.location" dense />
    </div>

    <q-separator />

    <!-- Teammates -->
    <div v-for="(teammate, tIndex) in campaign.data.team.teammates" :key="tIndex">
      <div class="text-h4 sf-header text-center q-mt-md q-mb-sm" :id="`teammate-${tIndex}`">
        {{ teammate.name }}
      </div>

      <!-- Name, pronouns, callsign etc -->
      <div class="row full-width items-center">
        <q-input class="col-grow" label="Name" v-model="teammate.name" dense />
        <q-input class="col-4" label="Pronouns" v-model="teammate.pronouns" dense />
      </div>
      <div class="row full-width items-center">
        <q-input class="col-xs-4 col-sm-3 col-2" label="Callsign" v-model="teammate.callsign" dense />
        <q-input class="col-grow" label="Characteristics" v-model="teammate.characteristics" dense />
      </div>

      <!-- Momentum -->
      <div class="row justify-between items-center" v-if="$q.screen.gt.xs">
        <span class="col-shrink text-bold q-mx-sm">Momentum</span>
        <resource-track class="col-grow" v-model="teammate.tracks.momentum" />
        <q-input
          class="col-xs-2 col-sm-1 col-1"
          label="Max"
          type="number"
          :max="10"
          :min="-6"
          v-model="teammate.tracks.momentum.max"
          dense
          borderless
        />
        <q-input
          class="col-xs-2 col-sm-1 col-1"
          label="Reset"
          type="number"
          :max="4"
          :min="0"
          v-model="teammate.tracks.momentum.reset"
          dense
          borderless
        />
        <q-btn class="col-shrink" icon="mdi-fire" @click="burnMomentum(teammate)" flat dense>
          <q-tooltip>Burn momentum</q-tooltip>
        </q-btn>
      </div>
      <div v-else>
        <div class="row items-center">
          <span class="col-grow text-h6">Momentum</span>
          <q-input
            class="col-xs-2 col-sm-1 col-1"
            label="Max"
            type="number"
            :max="10"
            :min="-6"
            v-model="teammate.tracks.momentum.max"
            dense
            borderless
          />
          <q-input
            class="col-xs-2 col-sm-1 col-1"
            label="Reset"
            type="number"
            :max="4"
            :min="0"
            v-model="teammate.tracks.momentum.reset"
            dense
            borderless
          />
          <q-btn class="col-shrink" icon="mdi-fire" @click="burnMomentum(teammate)" flat dense>
            <q-tooltip>Burn momentum</q-tooltip>
          </q-btn>
        </div>
        <resource-track class="row full-width" v-model="teammate.tracks.momentum" />
      </div>

      <q-separator />

      <!-- Tracks -->
      <div class="row justify-between items-center" v-if="$q.screen.gt.xs">
        <span class="col-shrink text-bold q-mx-sm">Health</span>
        <resource-track class="col-grow" v-model="teammate.tracks.health" />
        <q-separator vertical />

        <span class="col-shrink text-bold q-mx-sm">Spirit</span>
        <resource-track class="col-grow" v-model="teammate.tracks.spirit" />
        <q-separator vertical />

        <span class="col-shrink text-bold q-mx-sm">Supply</span>
        <resource-track class="col-grow" v-model="teammate.tracks.supply" />
      </div>
      <div v-else>
        <div class="row justify-between items-center">
          <span class="col-2 text-bold">Health</span>
          <resource-track class="col-grow" v-model="teammate.tracks.health" />
        </div>

        <div class="row justify-between items-center">
          <span class="col-2 text-bold">Spirit</span>
          <resource-track class="col-grow" v-model="teammate.tracks.spirit" />
        </div>

        <div class="row justify-between items-center">
          <span class="col-2 text-bold">Supply</span>
          <resource-track class="col-grow" v-model="teammate.tracks.supply" />
        </div>
      </div>

      <q-separator />

      <!-- Stats -->
      <stats class="q-mt-md" v-model="teammate.stats" />
      <i-input class="q-mt-md q-mb-md" label="Gear &amp; Notes" v-model="teammate.gear" autogrow />

      <q-separator />

      <!-- Assets -->
      <div class="text-h4 sf-header text-center q-mt-md q-mb-sm" :id="`assets-${tIndex}`">
        Assets<q-btn icon="add_circle" flat dense @click="showAssetSelect = true" />
      </div>

      <div class="row assets-container" v-if="$q.screen.gt.sm">
        <div class="col left-assets q-mr-xs">
          <div v-for="(a, i) in teammate.assets" :key="i">
            <asset class="q-mb-sm" v-if="i % 2 == 0" v-model="teammate.assets[i]">
              <template v-slot:append>
                <q-btn icon="delete" flat dense @click="removeAsset(teammate, i)" v-if="config.data.edit">
                  <q-tooltip>Remove asset</q-tooltip>
                </q-btn>
              </template>
            </asset>
          </div>
        </div>

        <div class="col right-assets q-ml-xs">
          <div v-for="(a, i) in teammate.assets" :key="i">
            <asset class="q-mb-sm" v-if="i % 2 != 0" v-model="teammate.assets[i]">
              <template v-slot:append>
                <q-btn icon="delete" flat dense @click="removeAsset(teammate, i)" v-if="config.data.edit">
                  <q-tooltip>Remove asset</q-tooltip>
                </q-btn>
              </template>
            </asset>
          </div>
        </div>
      </div>
      <div class="column assets-container" v-else>
        <div v-for="(a, i) in teammate.assets" :key="i">
          <asset class="q-mb-sm" v-model="teammate.assets[i]">
            <template v-slot:append>
              <q-btn icon="delete" flat dense @click="removeAsset(teammate, i)" v-if="config.data.edit">
                <q-tooltip>Remove asset</q-tooltip>
              </q-btn>
            </template>
          </asset>
        </div>
      </div>

      <q-separator />

      <!-- Legacy tracks -->
      <div class="text-h4 sf-header text-center q-mt-md q-mb-sm" :id="`legacies-${tIndex}`">Legacy Tracks</div>
      <legacy-track name="Quests" v-model="teammate.legacies.quests" />
      <q-separator />
      <legacy-track name="Bonds" v-model="teammate.legacies.bonds" />
      <q-separator />
      <legacy-track name="Discoveries" v-model="teammate.legacies.discoveries" />

      <q-separator />

      <div class="row">
        <!-- Impacts -->
        <div class="col-12 text-h4 sf-header text-center q-pt-md" :id="`impacts-${tIndex}`">Impacts</div>
        <div class="col-xs-6 col-sm-3 col-3" v-for="(set, setIndex) in teammate.impacts" :key="setIndex">
          <div class="text-bold">{{ setIndex }}</div>
          <q-checkbox
            class="row"
            v-for="(impact, iIndex) in teammate.impacts[setIndex]"
            :key="iIndex"
            :label="impact.name"
            v-model="teammate.impacts[setIndex][iIndex].marked"
            @click="markImpact(teammate)"
          >
          </q-checkbox>
        </div>
      </div>

      <assets v-model="showAssetSelect" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ITeammate } from 'src/components/models'; // Adjust the path as necessary

import { useCampaign } from 'src/store/campaign';
import { useConfig } from 'src/store/config';

import Stats from 'src/components/Stats/Stats.vue';
import Asset from 'src/components/Assets/Asset.vue';
import Assets from 'src/components/Assets/Assets.vue';
import ResourceTrack from 'src/components/Tracks/ResourceTrack.vue';
import LegacyTrack from 'src/components/Tracks/LegacyTrack.vue';
import IInput from 'src/components/Widgets/IInput.vue';

export default defineComponent({
  name: 'Team',
  components: {
    LegacyTrack,
    ResourceTrack,
    Stats,
    Asset,
    Assets,
    IInput,
  },
  setup() {
    const campaign = useCampaign();

    const removeAsset = (teammate: ITeammate, index: number) => teammate.assets.splice(index, 1);
    const showAssetSelect = ref(false);

    const markImpact = (teammate: ITeammate) => {
      let marked = 0;
      Object.values(teammate.impacts).forEach((set) => {
        set.forEach((impact) => {
          if (impact.marked) {
            marked++;
          }
        });
      });

      if (marked === 1) {
        teammate.tracks.momentum.reset = 1;
      } else if (marked > 1) {
        teammate.tracks.momentum.reset = 0;
      } else {
        teammate.tracks.momentum.reset = 2;
      }

      teammate.tracks.momentum.max = 10 - marked;
    };

    const burnMomentum = (teammate: ITeammate) => {
      const n = +teammate.tracks.momentum.reset;
      teammate.tracks.momentum.value = n;
    };

    const config = useConfig();

    return {
      campaign,

      removeAsset,
      showAssetSelect,

      markImpact,

      burnMomentum,
      config,
    };
  },
});
</script>
