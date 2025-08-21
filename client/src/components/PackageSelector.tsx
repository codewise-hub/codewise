import { useState, useEffect } from 'react';

export interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  duration: string;
  features: string;
  maxStudents: number | null;
  packageType: 'individual' | 'school';
  isActive: boolean;
}

interface PackageSelectorProps {
  packageType: 'individual' | 'school';
  selectedPackageId: string;
  onPackageSelect: (packageId: string) => void;
}

export function PackageSelector({ packageType, selectedPackageId, onPackageSelect }: PackageSelectorProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Try multiple API paths for Vercel compatibility
        const possiblePaths = ['/api/packages', './api/packages', window.location.origin + '/api/packages'];
        let response;
        let allPackages = [];
        
        for (const path of possiblePaths) {
          try {
            console.log('Trying to fetch from:', path);
            response = await fetch(path, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            
            if (response.ok) {
              allPackages = await response.json();
              console.log('Successfully fetched from:', path, 'Packages:', allPackages);
              break;
            } else {
              console.log('Failed to fetch from:', path, 'Status:', response.status);
            }
          } catch (err) {
            console.log('Error with path:', path, err);
            continue;
          }
        }

        if (allPackages.length === 0) {
          // Fallback: Use hardcoded packages with correct ZAR pricing
          console.log('Using fallback packages for packageType:', packageType);
          allPackages = packageType === 'school' ? [
            {
              id: 'school-basic',
              name: 'School Basic',
              description: 'Essential package for small schools and classrooms',
              price: '6999.00',
              currency: 'ZAR',
              duration: 'monthly',
              features: '["Up to 30 Students", "Teacher Dashboard", "Classroom Management", "Assignment Tools", "Progress Analytics", "Email Support"]',
              packageType: 'school',
              isActive: true
            },
            {
              id: 'school-premium',
              name: 'School Premium',
              description: 'Complete solution for larger schools with advanced features',
              price: '17499.00',
              currency: 'ZAR',
              duration: 'monthly',
              features: '["Up to 100 Students", "Advanced Analytics", "Custom Curriculum", "Teacher Training", "Priority Support", "Custom Branding"]',
              packageType: 'school',
              isActive: true
            }
          ] : [
            {
              id: 'basic-explorer',
              name: 'Basic Explorer',
              description: 'Perfect for young coders starting their journey',
              price: '349.00',
              currency: 'ZAR',
              duration: 'monthly',
              features: '["Visual Block Programming", "Basic Coding Concepts", "5 Interactive Projects", "Progress Tracking", "Email Support"]',
              packageType: 'individual',
              isActive: true
            },
            {
              id: 'pro-coder',
              name: 'Pro Coder',
              description: 'Advanced learning path with text-based programming',
              price: '699.00',
              currency: 'ZAR',
              duration: 'monthly',
              features: '["Text-Based Programming", "Advanced Projects", "AI/Prompt Engineering", "Unlimited Projects", "Priority Support", "Certificate Program"]',
              packageType: 'individual',
              isActive: true
            },
            {
              id: 'family-plan',
              name: 'Family Plan',
              description: 'Multiple children learning together with parental oversight',
              price: '999.00',
              currency: 'ZAR',
              duration: 'monthly',
              features: '["Up to 4 Children", "All Features Included", "Parent Dashboard", "Progress Reports", "Family Projects", "Priority Support"]',
              packageType: 'individual',
              isActive: true
            }
          ];
        }

        console.log('Raw fetched packages:', allPackages);
        console.log('Looking for packageType:', packageType);
        
        const filteredPackages = allPackages.filter((pkg: Package) => {
          console.log(`Package ${pkg.name}: type=${pkg.packageType}, active=${pkg.isActive}, matches=${pkg.packageType === packageType}`);
          return pkg.packageType === packageType && pkg.isActive;
        });
        console.log('Final filtered packages for', packageType, ':', filteredPackages);
        setPackages(filteredPackages);
      } catch (error) {
        console.error('Error fetching packages:', error);
        setPackages([]); // Ensure we don't get stuck in loading state
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [packageType]);

  if (loading) {
    return <div className="text-center py-4">Loading packages...</div>;
  }

  if (packages.length === 0) {
    return (
      <div className="text-center py-4">
        <p>No packages available for {packageType} users</p>
        <p className="text-sm text-gray-500 mt-2">
          Expected package type: {packageType}
        </p>
        <details className="mt-2">
          <summary className="text-xs text-blue-500 cursor-pointer">Debug Info</summary>
          <div className="text-xs text-left mt-2">
            <div>Fetch URL: /api/packages</div>
            <div>Package Type Filter: {packageType}</div>
            <div>Loading: {loading.toString()}</div>
          </div>
        </details>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">
        Choose Your {packageType === 'individual' ? 'Learning' : 'School'} Package
      </h3>
      
      <div className="grid gap-4">
        {packages.map((pkg) => {
          console.log('Rendering package:', pkg.name, 'features:', pkg.features);
          let features: string[] = [];
          try {
            if (pkg.features) {
              // Check if it's JSON array
              if (pkg.features.startsWith('[')) {
                features = JSON.parse(pkg.features);
              } else {
                // Fallback to comma-split
                features = pkg.features.split(',').map(f => f.trim());
              }
            }
          } catch (e) {
            console.error('Error parsing features for', pkg.name, ':', e);
            features = [];
          }
          
          return (
            <div
              key={pkg.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedPackageId === pkg.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onPackageSelect(pkg.id)}
              data-testid={`package-option-${pkg.id}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-lg">{pkg.name}</h4>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {pkg.currency === 'ZAR' ? 'R' : '$'}{pkg.price}
                  </div>
                  <div className="text-sm text-gray-500">
                    per {pkg.duration}
                  </div>
                </div>
              </div>
              
              {pkg.description && (
                <p className="text-gray-600 mb-3">{pkg.description}</p>
              )}
              
              {pkg.maxStudents && (
                <p className="text-sm text-gray-500 mb-2">
                  Up to {pkg.maxStudents} students
                </p>
              )}
              
              {features.length > 0 && (
                <ul className="text-sm space-y-1">
                  {features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              
              <div className="mt-3">
                <input
                  type="radio"
                  name="package"
                  value={pkg.id}
                  checked={selectedPackageId === pkg.id}
                  onChange={() => onPackageSelect(pkg.id)}
                  className="mr-2"
                  data-testid={`radio-package-${pkg.id}`}
                />
                <label className="text-sm font-medium">
                  Select {pkg.name}
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}