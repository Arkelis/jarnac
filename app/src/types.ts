interface TeamDefinition {
  name: string;
  letter?: string;
}

export interface TeamsToDefine {
  team1: TeamDefinition;
  team2: TeamDefinition;
  firstTeam?: Team;
}

export interface Teams {
  team1: string;
  team2: string;
}

export enum Team {
  team1 = "team1",
  team2 = "team2",
}

export function opponent(t: Team): Team {
  return t == Team.team1 ? Team.team2 : Team.team1;
}
