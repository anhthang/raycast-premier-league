import { List } from "@raycast/api";
import useSeasons from "../hooks/useSeasons";

export default function SeasonDropdown(props: {
  onSelect: React.Dispatch<React.SetStateAction<string>>;
}) {
  const seasons = useSeasons();

  return (
    <List.Dropdown tooltip="Filter by Season" onChange={props.onSelect}>
      <List.Dropdown.Section>
        {seasons.map((season) => {
          return (
            <List.Dropdown.Item
              key={season.id}
              value={season.id.toString()}
              title={season.label}
            />
          );
        })}
      </List.Dropdown.Section>
    </List.Dropdown>
  );
}
