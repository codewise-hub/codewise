import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Star, Users, GraduationCap, Building2 } from "lucide-react";

export function PricingPage() {
  const [packageType, setPackageType] = useState<'student' | 'school'>('student');

  const studentPackages = [
    {
      id: 'young_coder_basic',
      name: 'Young Coder Basic',
      price: 'R299',
      period: '/month',
      description: 'Perfect for children ages 6-11 starting their coding journey',
      features: [
        'Visual block-based programming',
        'Interactive coding games',
        'Basic robotics activities',
        'Progress tracking',
        'Parent dashboard access',
        '5 hours of coding content per month'
      ],
      popular: false,
      ageGroup: '6-11 years',
      color: 'blue'
    },
    {
      id: 'young_coder_premium',
      name: 'Young Coder Premium',
      price: 'R499',
      period: '/month',
      description: 'Enhanced learning experience for young coders',
      features: [
        'Everything in Basic',
        'Advanced block programming',
        'Micro:bit simulator access',
        'Creative project challenges',
        'Video tutorials',
        'Priority support',
        'Unlimited coding content'
      ],
      popular: true,
      ageGroup: '6-11 years',
      color: 'purple'
    },
    {
      id: 'teen_coder_pro',
      name: 'Teen Coder Pro',
      price: 'R699',
      period: '/month',
      description: 'Advanced coding education for teenagers',
      features: [
        'Text-based programming languages',
        'Web development projects',
        'AI & Prompt Engineering course',
        'Advanced robotics',
        'Code collaboration tools',
        'Career guidance',
        'Industry mentorship program'
      ],
      popular: false,
      ageGroup: '12-17 years',
      color: 'green'
    }
  ];

  const schoolPackages = [
    {
      id: 'school_standard',
      name: 'School Standard',
      price: 'R6,999',
      period: '/month',
      description: 'Comprehensive coding education for schools',
      features: [
        'Up to 200 student accounts',
        'Teacher dashboard and tools',
        'Curriculum planning resources',
        'Progress analytics',
        'Parent communication tools',
        'Basic support',
        'Monthly training sessions'
      ],
      popular: true,
      maxStudents: 200,
      color: 'blue'
    },
    {
      id: 'school_enterprise',
      name: 'School Enterprise',
      price: 'R17,499',
      period: '/month',
      description: 'Enterprise-grade solution for large institutions',
      features: [
        'Unlimited student accounts',
        'Advanced analytics dashboard',
        'Custom curriculum development',
        'Dedicated account manager',
        'Priority support',
        'On-site training programs',
        'API access for integrations',
        'White-label options'
      ],
      popular: false,
      maxStudents: 'Unlimited',
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string, isPopular: boolean) => {
    const baseClasses = isPopular ? 'ring-2 ring-purple-500' : '';
    switch (color) {
      case 'blue':
        return `${baseClasses} border-blue-200 bg-blue-50`;
      case 'purple':
        return `${baseClasses} border-purple-200 bg-purple-50`;
      case 'green':
        return `${baseClasses} border-green-200 bg-green-50`;
      default:
        return baseClasses;
    }
  };

  const getButtonClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'green':
        return 'bg-green-600 hover:bg-green-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Learning Path
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock the world of coding with our comprehensive educational packages designed for young learners and schools
          </p>
        </div>

        {/* Package Type Toggle */}
        <div className="flex justify-center mb-12">
          <Tabs value={packageType} onValueChange={(value: string) => setPackageType(value as 'student' | 'school')} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student" className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4" />
                <span>Student Plans</span>
              </TabsTrigger>
              <TabsTrigger value="school" className="flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span>School Plans</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Student Packages */}
        {packageType === 'student' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {studentPackages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`relative ${getColorClasses(pkg.color, pkg.popular)} transition-all duration-200 hover:shadow-lg`}
                data-testid={`card-package-${pkg.id}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    {pkg.description}
                  </CardDescription>
                  <div className="flex justify-center items-baseline space-x-2">
                    <span className="text-4xl font-bold text-gray-900">{pkg.price}</span>
                    <span className="text-gray-600">{pkg.period}</span>
                  </div>
                  <Badge variant="outline" className="mt-2">
                    Ages {pkg.ageGroup}
                  </Badge>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${getButtonClasses(pkg.color)} text-white`}
                    data-testid={`button-select-${pkg.id}`}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* School Packages */}
        {packageType === 'school' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            {schoolPackages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`relative ${getColorClasses(pkg.color, pkg.popular)} transition-all duration-200 hover:shadow-lg`}
                data-testid={`card-package-${pkg.id}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    {pkg.description}
                  </CardDescription>
                  <div className="flex justify-center items-baseline space-x-2">
                    <span className="text-4xl font-bold text-gray-900">{pkg.price}</span>
                    <span className="text-gray-600">{pkg.period}</span>
                  </div>
                  <Badge variant="outline" className="mt-2">
                    <Users className="w-3 h-3 mr-1" />
                    {pkg.maxStudents} students
                  </Badge>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${getButtonClasses(pkg.color)} text-white`}
                    data-testid={`button-select-${pkg.id}`}
                  >
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What age groups do you support?
              </h3>
              <p className="text-gray-600">
                We offer specialized programs for Young Coders (ages 6-11) with visual block programming 
                and Teen Coders (ages 12-17) with text-based coding and advanced projects.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I switch between packages?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your package at any time. Changes will be reflected 
                in your next billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Do you offer school discounts?
              </h3>
              <p className="text-gray-600">
                Our School packages are designed specifically for educational institutions with 
                bulk pricing and specialized features for classroom management.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                What programming languages are taught?
              </h3>
              <p className="text-gray-600">
                Young Coders start with visual block programming, while Teen Coders learn Python, 
                JavaScript, HTML/CSS, and AI/prompt engineering.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-gray-600 mb-6">
            Our education specialists are here to help you find the perfect learning solution
          </p>
          <Button variant="outline" size="lg" data-testid="button-contact-sales">
            Contact Our Team
          </Button>
        </div>
      </div>
    </div>
  );
}