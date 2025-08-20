import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Code, Cpu, Globe, Users, Clock, Trophy } from 'lucide-react';
import type { Course, Lesson, RoboticsActivity } from '@shared/schema';

export function AdminCourseManager() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  
  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });
  
  const { data: roboticsActivities = [], isLoading: activitiesLoading } = useQuery<RoboticsActivity[]>({
    queryKey: ['/api/robotics-activities'],
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'programming': return <Code className="h-4 w-4" />;
      case 'web-development': return <Globe className="h-4 w-4" />;
      case 'robotics': return <Cpu className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCourses = selectedAgeGroup === 'all' 
    ? courses 
    : courses.filter((course) => course.ageGroup === selectedAgeGroup);

  const filteredActivities = selectedAgeGroup === 'all'
    ? roboticsActivities
    : roboticsActivities.filter((activity) => activity.ageGroup === selectedAgeGroup);

  if (coursesLoading || activitiesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading course material...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600 mt-2">Manage and view all educational content</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={selectedAgeGroup === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedAgeGroup('all')}
          >
            All Ages
          </Button>
          <Button
            variant={selectedAgeGroup === '6-11' ? 'default' : 'outline'}
            onClick={() => setSelectedAgeGroup('6-11')}
          >
            Ages 6-11
          </Button>
          <Button
            variant={selectedAgeGroup === '12-17' ? 'default' : 'outline'}
            onClick={() => setSelectedAgeGroup('12-17')}
          >
            Ages 12-17
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              Active learning paths
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Robotics Activities</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roboticsActivities.length}</div>
            <p className="text-xs text-muted-foreground">
              Interactive challenges
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {courses.length > 0 ? courses.length * 3 : 'Loading...'}
            </div>
            <p className="text-xs text-muted-foreground">
              Educational content
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="robotics">Robotics Activities</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={getDifficultyColor(course.difficulty || 'beginner')}>
                      {course.difficulty || 'beginner'}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(course.category || 'programming')}
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Ages {course.ageGroup}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.estimatedHours}h
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{course.category}</Badge>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="robotics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={activity.imageUrl || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300'}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={getDifficultyColor(activity.difficulty || 'easy')}>
                      {activity.difficulty || 'easy'}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Trophy className="h-3 w-3" />
                      {activity.points} pts
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-lg">{activity.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {activity.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Ages {activity.ageGroup}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.estimatedMinutes}min
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{activity.type}</Badge>
                      <Button size="sm" variant="outline">
                        Try Challenge
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}