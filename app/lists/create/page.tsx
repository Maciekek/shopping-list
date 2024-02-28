import { CreateListForm } from '@/components/organisms/CreateListForm';

export default function createList({ params }: { params: { slug: string } }) {
  return (
    <div>
      <CreateListForm/>
    </div>
  );
}
