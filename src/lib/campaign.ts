import { ICampaign, ITeam, ITeammate, IJournalEntry, IFaction } from 'src/components/models';

import { v4 as uuid } from 'uuid';
import * as oracle from 'src/lib/oracles';
import { NewSector } from './sector';
import { NewLegacyTrack, NewProgressTrack, NewClock } from './tracks';

// Teammate
export const NewTeammate = (): ITeammate => {
  return {
    name: `${oracle.roll('Starforged/Oracles/Characters/Name/Given_Name')} ${oracle.roll(
      'Starforged/Oracles/Characters/Name/Family_Name'
    )}`,
    pronouns: '',
    callsign: oracle.roll('Starforged/Oracles/Characters/Name/Callsign'),
    characteristics: '',
    stats: {
      edge: 0,
      heart: 0,
      iron: 0,
      shadow: 0,
      wits: 0,
    },
    tracks: {
      health: { value: 5, max: 5, min: 0 },
      spirit: { value: 5, max: 5, min: 0 },
      supply: { value: 5, max: 5, min: 0 },
      momentum: { value: 2, max: 10, min: -6, reset: 2 },
    },
    legacies: {
      quests: NewLegacyTrack(),
      bonds: NewLegacyTrack(),
      discoveries: NewLegacyTrack(),
    },
    impacts: {
      Misfortunes: [
        {
          name: 'Wounded',
          marked: false,
        },
        {
          name: 'Shaken',
          marked: false,
        },
        {
          name: 'Unprepared',
          marked: false,
        },
      ],
      'Lasting Effects': [
        {
          name: 'Permanently Harmed',
          marked: false,
        },
        {
          name: 'Traumatized',
          marked: false,
        },
      ],
      Burdens: [
        {
          name: 'Doomed',
          marked: false,
        },
        {
          name: 'Tormented',
          marked: false,
        },
        {
          name: 'Indebted',
          marked: false,
        },
      ],
      'Current Vehicle': [
        {
          name: 'Battered',
          marked: false,
        },
        {
          name: 'Cursed',
          marked: false,
        },
      ],
    },
    gear: '',
    assets: [],
    individualVows: [NewProgressTrack()], // Initialize individual vows
    individualClocks: [NewClock()], // Initialize individual clocks
  };
};

// Team
export const NewTeam = (): ITeam => {
  return {
    name: 'New Team',
    location: '',
    sharedVows: [NewProgressTrack()],
    sharedClocks: [NewClock()],
    teammates: [NewTeammate(), NewTeammate()], // Initialize with multiple teammates
  };
};

export const NewJournal = (): IJournalEntry => {
  return {
    title: 'New journal entry',
    content: '',
    pinned: false,
  };
};

export const NewFaction = (): IFaction => {
  return {
    id: uuid(),
    name: '',
    type: '',
    influence: '',
    sphere: '',
    projects: '',
    relationships: '',
    quirks: '',
    rumors: '',
    notes: '',
    colour: 'red',
  };
};

export const NewCampaign = (): ICampaign => {
  const team = NewTeam();

  return {
    id: uuid(),
    name: `New Campaign - ${team.teammates[0].name}`,
    team: team,
    progressTracks: [NewProgressTrack()],
    journal: [NewJournal()],
    truths: {},
    sectors: [NewSector()],
    factions: [NewFaction()],
  };
};
