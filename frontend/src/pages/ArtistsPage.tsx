import { Layout } from '../components/Layout/Layout';
import { ArtistsDataTable } from '../components/ArtistsDataTable/ArtistsDataTable';

export const ArtistsPage = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Artistas</h1>
            <p className="text-gray-600 mt-2 font-mono">Gerencie artistas do catálogo</p>
          </div>
        </div>

        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <ArtistsDataTable />
        </div>
      </div>
    </Layout>
  );
};
