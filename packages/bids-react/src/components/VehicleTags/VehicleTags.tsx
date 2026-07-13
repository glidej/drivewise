import { Tags } from './VehicleTags.styles';

export interface VehicleTagsProps {
  tags: readonly string[];
}

export function VehicleTags({ tags }: VehicleTagsProps) {
  return (
    <Tags>
      {tags.map((tag) => (
        <span key={tag}>{tag}</span>
      ))}
    </Tags>
  );
}
