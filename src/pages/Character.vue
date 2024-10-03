<template>
  <q-page padding>
    <!-- Team Information -->
    <div class="text-h4 sf-header text-center q-mb-sm" id="team-info">Team Information</div>
    <div class="row full-width items-center" id="top">
      <q-input class="col-grow" label="Team Name" v-model="campaign.data.team.name" dense />
      <q-input class="col-4" label="Location" v-model="campaign.data.team.location" dense />
    </div>
    <q-separator />

    <!-- Stats -->
    <i-input class="q-mt-md q-mb-md" label="Shared Gear &amp; Notes" autogrow />

    <q-separator />

    <!-- Teammates -->
    <q-expansion-item
      v-for="(teammate, tIndex) in campaign.data.team.teammates"
      :key="tIndex"
      :label="teammate.name"
      expand-separator
      dense
    >
      <template v-slot:header>
        <div class="row full-width items-center justify-between">
          <!-- Group 1: Callsign/Name -->
          <div class="col-auto group q-pa-md">
            <div class="row items-center">
              <div class="col text-left">{{ teammate.callsign || teammate.name }}</div>
            </div>
          </div>

          <!-- Centered Groups 2 and 3 with Separation (hidden on small screens) -->
          <div v-if="$q.screen.gt.xs" class="row items-center justify-center q-pa-md">
            <!-- Group 2: Momentum, Health, Spirit, Supply -->
            <div class="col-auto group q-pa-md">
              <div class="row items-center justify-center">
                <div class="col text-center q-mr-md">
                  <q-icon name="mdi-fire" /> {{ teammate.tracks.momentum.value }}
                </div>
                <div class="col text-center q-mr-md">
                  <q-icon name="mdi-heart" /> {{ teammate.tracks.health.value }}
                </div>
                <div class="col text-center q-mr-md">
                  <q-icon name="mdi-emoticon-happy" /> {{ teammate.tracks.spirit.value }}
                </div>
                <div class="col text-center">
                  <q-icon name="mdi-package-variant" /> {{ teammate.tracks.supply.value }}
                </div>
              </div>
            </div>

            <!-- Separation -->
            <div class="q-mx-md"></div>

            <!-- Group 3: Stats -->
            <div class="col-auto group q-pa-md">
              <div class="row items-center justify-center">
                <div class="col text-center q-mr-md"><q-icon name="mdi-sword" /> {{ teammate.stats.edge }}</div>
                <div class="col text-center q-mr-md"><q-icon name="mdi-heart-pulse" /> {{ teammate.stats.heart }}</div>
                <div class="col text-center q-mr-md"><q-icon name="mdi-shield" /> {{ teammate.stats.iron }}</div>
                <div class="col text-center q-mr-md"><q-icon name="mdi-eye" /> {{ teammate.stats.shadow }}</div>
                <div class="col text-center"><q-icon name="mdi-brain" /> {{ teammate.stats.wits }}</div>
              </div>
            </div>
          </div>

          <!-- Group 4: Delete Button -->
          <div class="col-auto group q-pa-md">
            <div class="row items-center justify-end">
              <q-btn
                v-if="config.data.edit"
                class="col-shrink"
                icon="delete"
                flat
                dense
                @click="confirmDeleteTeammate(tIndex)"
              >
                <q-tooltip>Delete teammate</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </template>

      <!-- Expanded Content -->
      <div class="text-h4 sf-header text-center q-mt-md q-mb-sm">{{ teammate.name }}</div>

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
    </q-expansion-item>

    <!-- Add Teammate Button -->
    <div class="row justify-center q-mt-md">
      <q-btn icon="add_circle" label="Add Teammate" @click="addTeammate" />
    </div>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteConfirm">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" />
          <span class="q-ml-sm">Are you sure you want to delete this teammate?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteTeammate" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ITeammate } from 'src/components/models';
import { NewTeammate } from 'src/lib/campaign';

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

    const showDeleteConfirm = ref(false);
    const teammateToDelete = ref<number | null>(null);

    const addTeammate = () => {
      campaign.data.team.teammates.push(NewTeammate());
    };

    const confirmDeleteTeammate = (index: number) => {
      teammateToDelete.value = index;
      showDeleteConfirm.value = true;
    };

    const deleteTeammate = () => {
      if (teammateToDelete.value !== null) {
        campaign.data.team.teammates.splice(teammateToDelete.value, 1);
        teammateToDelete.value = null;
        showDeleteConfirm.value = false;
      }
    };

    return {
      campaign,
      config,
      showAssetSelect,
      showDeleteConfirm,
      teammateToDelete,
      addTeammate,
      confirmDeleteTeammate,
      deleteTeammate,
      removeAsset,
      markImpact,
      burnMomentum,
    };
  },
});
</script>
