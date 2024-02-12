import { CreateList } from '../../ui/forms/CreateList';

export default function createList({ params }: { params: { slug: string } }) {
  return (
    <div>
      <CreateList/>
    </div>
  );
}
