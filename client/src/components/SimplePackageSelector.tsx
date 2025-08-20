import { useState, useEffect } from 'react';

export interface SimplePackage {
  id: string;
  name: string;
  price: string;
  currency: string;
}

interface SimplePackageSelectorProps {
  packageType: 'individual' | 'school';
  selectedPackageId: string;
  onPackageSelect: (packageId: string) => void;
}

export function SimplePackageSelector({ 
  packageType, 
  selectedPackageId, 
  onPackageSelect 
}: SimplePackageSelectorProps) {
  const [packages, setPackages] = useState<SimplePackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set packages based on type immediately
    const packageData = packageType === 'school' ? [
      { id: 'school-basic', name: 'School Basic', price: '6999', currency: 'ZAR' },
      { id: 'school-premium', name: 'School Premium', price: '17499', currency: 'ZAR' }
    ] : [
      { id: 'basic-explorer', name: 'Basic Explorer', price: '349', currency: 'ZAR' },
      { id: 'pro-coder', name: 'Pro Coder', price: '699', currency: 'ZAR' },
      { id: 'family-plan', name: 'Family Plan', price: '999', currency: 'ZAR' }
    ];
    
    setPackages(packageData);
    setLoading(false);
  }, [packageType]);

  if (loading) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Loading packages...
        </label>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Choose Your Package:
      </label>
      <select
        value={selectedPackageId}
        onChange={(e) => onPackageSelect(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        data-testid="package-selector"
      >
        <option value="">Select a package</option>
        {packages.map((pkg) => (
          <option key={pkg.id} value={pkg.id} data-testid={`package-option-${pkg.id}`}>
            {pkg.name} - R{pkg.price}/month
          </option>
        ))}
      </select>
      
      {selectedPackageId && (
        <div className="mt-2 p-2 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Selected: {packages.find(p => p.id === selectedPackageId)?.name} 
            - R{packages.find(p => p.id === selectedPackageId)?.price}/month
          </p>
        </div>
      )}
    </div>
  );
}