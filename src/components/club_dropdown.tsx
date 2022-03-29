import { List } from "@raycast/api";

interface Club {
  title: string;
  value: string;
}

export default function ClubDropdown(props: {
  teams: Club[];
  onSelect: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <List.Dropdown tooltip="Filter by Club" onChange={props.onSelect}>
      <List.Dropdown.Section>
        {props.teams.map((team) => {
          return (
            <List.Dropdown.Item
              key={team.value}
              value={team.value}
              title={team.title}
            />
          );
        })}
      </List.Dropdown.Section>
    </List.Dropdown>
  );
}
