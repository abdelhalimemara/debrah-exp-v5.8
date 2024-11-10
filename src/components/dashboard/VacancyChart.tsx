import { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface BuildingVacancy {
  building_name: string;
  total_units: number;
  vacant_units: number;
  vacancy_rate: number;
}

export function VacancyChart() {
  const [vacancies, setVacancies] = useState<BuildingVacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const officeId = localStorage.getItem('office_id');
        if (!officeId) throw new Error('No office ID found');

        const { data: buildings, error: buildingsError } = await supabase
          .from('buildings')
          .select(`
            id,
            name,
            total_units
          `)
          .eq('office_id', officeId)
          .limit(5);

        if (buildingsError) throw buildingsError;

        const buildingVacancies = await Promise.all(
          (buildings || []).map(async (building) => {
            const { count } = await supabase
              .from('units')
              .select('*', { count: 'exact', head: true })
              .eq('building_id', building.id)
              .eq('status', 'vacant');

            const vacantUnits = count || 0;
            const vacancyRate = Math.round((vacantUnits / building.total_units) * 100);

            return {
              building_name: building.name,
              total_units: building.total_units,
              vacant_units: vacantUnits,
              vacancy_rate: vacancyRate,
            };
          })
        );

        setVacancies(buildingVacancies);
      } catch (error) {
        console.error('Error fetching vacancies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Vacancy Rates</h2>
      </div>

      {vacancies.length === 0 ? (
        <div className="p-6 text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No buildings yet</h3>
          <p className="mt-1 text-sm text-gray-500">Add buildings to see vacancy rates</p>
        </div>
      ) : (
        <div className="p-6 space-y-4">
          {vacancies.map((vacancy) => (
            <div key={vacancy.building_name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-900">{vacancy.building_name}</span>
                <span className="text-gray-500">
                  {vacancy.vacant_units} / {vacancy.total_units} units vacant
                </span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full ${
                    vacancy.vacancy_rate > 20 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${100 - vacancy.vacancy_rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}