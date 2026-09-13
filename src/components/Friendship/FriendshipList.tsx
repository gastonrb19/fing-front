import FriendshipListItem, { type FriendshipPerson } from "./FriendshipListItem";

interface FriendshipListProps {
  people: FriendshipPerson[];
  selectedId?: string | null;
  onSelect?: (personId: string) => void;
}

export default function FriendshipList({
  people,
  selectedId = null,
  onSelect,
}: FriendshipListProps) {
  return (
    <ul className="flex w-full flex-col items-center gap-2">
      {people.map((person) => (
        <FriendshipListItem
          key={person.id}
          person={person}
          selected={selectedId === person.id}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}
