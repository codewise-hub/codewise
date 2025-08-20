import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, GraduationCap, School, Settings, BarChart3 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User, School as SchoolType } from "@shared/schema";
import type { AuthUser } from "@/types/user";

interface SchoolAdminDashboardProps {
  user: AuthUser;
}

export function SchoolAdminDashboard({ user }: SchoolAdminDashboardProps) {
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    role: "",
    grade: "",
    ageGroup: "",
  });
  const [newSchoolForm, setNewSchoolForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    maxStudents: 100,
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get school information - use mock data if no schoolId
  const { data: school } = useQuery<SchoolType>({
    queryKey: ["/api/schools", user.schoolId || "mock"],
    queryFn: async () => {
      if (!user.schoolId) {
        // Return mock school data
        return {
          id: "mock-school-id",
          name: user.schoolName || "Demo School",
          address: "123 Education Street",
          phone: "(555) 123-4567",
          email: "admin@school.edu",
          adminUserId: user.id,
          packageId: null,
          subscriptionStatus: "active",
          subscriptionStart: new Date(),
          subscriptionEnd: null,
          maxStudents: 100,
          currentStudents: 25,
          createdAt: new Date(),
        };
      }
      const response = await fetch(`/api/schools/${user.schoolId}`);
      return await response.json();
    },
  });

  // Get school users with mock data
  const { data: schoolUsers, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/schools", user.schoolId || "mock", "users"],
    queryFn: async () => {
      // Return mock users data
      return [
        {
          id: "teacher-1",
          email: "teacher1@school.edu",
          firstName: "Sarah",
          lastName: "Johnson", 
          profileImageUrl: null,
          role: "teacher",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "student-1", 
          email: "student1@school.edu",
          firstName: "Alex",
          lastName: "Smith",
          profileImageUrl: null,
          role: "student",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "student-2",
          email: "student2@school.edu", 
          firstName: "Emma",
          lastName: "Davis",
          profileImageUrl: null,
          role: "student",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];
    },
  });

  // Create new user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof newUserForm) => {
      return await apiRequest("/api/schools/create-user", "POST", {
        ...userData,
        schoolId: user.schoolId || "mock-school-id",
      });
    },
    onSuccess: () => {
      toast({
        title: "User Created",
        description: "New user has been successfully created.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/schools", user.schoolId || "mock", "users"],
      });
      setNewUserForm({
        name: "",
        email: "",
        role: "",
        grade: "",
        ageGroup: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create school mutation
  const createSchoolMutation = useMutation({
    mutationFn: async (schoolData: typeof newSchoolForm) => {
      return await apiRequest("/api/schools", "POST", {
        ...schoolData,
        adminUserId: user.id,
      });
    },
    onSuccess: () => {
      toast({
        title: "School Created",
        description: "Your school has been successfully set up.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/schools"],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create school. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email || !newUserForm.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createUserMutation.mutate(newUserForm);
  };

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolForm.name || !newSchoolForm.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in school name and email.",
        variant: "destructive",
      });
      return;
    }
    createSchoolMutation.mutate(newSchoolForm);
  };

  const students = schoolUsers?.filter(u => u.role === 'student') || [];
  const teachers = schoolUsers?.filter(u => u.role === 'teacher') || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            School Administration Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your school's coding program and users
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-blue-600">{students.length}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Teachers</p>
                  <p className="text-3xl font-bold text-green-600">{teachers.length}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Capacity</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {school?.currentStudents || students.length}/{school?.maxStudents || 100}
                  </p>
                </div>
                <School className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {school?.subscriptionStatus || "Active"}
                  </Badge>
                </div>
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="create-user">Create User</TabsTrigger>
            <TabsTrigger value="school">School Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>School Users</CardTitle>
                <CardDescription>
                  Manage teachers and students in your school
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Teachers ({teachers.length})</h3>
                    <div className="grid gap-3">
                      {teachers.map((teacher) => (
                        <div key={teacher.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{teacher.firstName} {teacher.lastName}</p>
                            <p className="text-sm text-gray-600">{teacher.email}</p>
                          </div>
                          <Badge variant="secondary">Teacher</Badge>
                        </div>
                      ))}
                      {teachers.length === 0 && (
                        <p className="text-gray-500 italic">No teachers yet</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Students ({students.length})</h3>
                    <div className="grid gap-3">
                      {students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{student.firstName} {student.lastName}</p>
                            <p className="text-sm text-gray-600">{student.email}</p>
                          </div>
                          <Badge variant="outline">Student</Badge>
                        </div>
                      ))}
                      {students.length === 0 && (
                        <p className="text-gray-500 italic">No students yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create User Tab */}
          <TabsContent value="create-user" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New User</CardTitle>
                <CardDescription>
                  Add a new teacher or student to your school
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="user-name">Full Name *</Label>
                      <Input
                        id="user-name"
                        value={newUserForm.name}
                        onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-email">Email Address *</Label>
                      <Input
                        id="user-email"
                        type="email"
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="user-role">Role *</Label>
                      <Select
                        value={newUserForm.role}
                        onValueChange={(value) => setNewUserForm({...newUserForm, role: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newUserForm.role === 'student' && (
                      <div>
                        <Label htmlFor="user-age-group">Age Group</Label>
                        <Select
                          value={newUserForm.ageGroup}
                          onValueChange={(value) => setNewUserForm({...newUserForm, ageGroup: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select age group" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="6-11">Little Coders (6-11 years)</SelectItem>
                            <SelectItem value="12-17">Teen Coders (12-17 years)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={createUserMutation.isPending}
                  >
                    {createUserMutation.isPending ? "Creating..." : "Create User"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* School Settings Tab */}
          <TabsContent value="school" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>School Information</CardTitle>
                <CardDescription>
                  Manage your school's basic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {school ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>School Name</Label>
                      <p className="text-lg font-semibold">{school.name}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p>{school.email}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p>{school.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <Label>Address</Label>
                      <p>{school.address || "Not provided"}</p>
                    </div>
                    <div>
                      <Label>Max Students</Label>
                      <p>{school.maxStudents}</p>
                    </div>
                    <div>
                      <Label>Subscription Status</Label>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {school.subscriptionStatus}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleCreateSchool} className="space-y-4">
                    <p className="text-gray-600 mb-4">Complete your school setup:</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="school-name">School Name *</Label>
                        <Input
                          id="school-name"
                          value={newSchoolForm.name}
                          onChange={(e) => setNewSchoolForm({...newSchoolForm, name: e.target.value})}
                          placeholder="Enter school name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="school-email">School Email *</Label>
                        <Input
                          id="school-email"
                          type="email"
                          value={newSchoolForm.email}
                          onChange={(e) => setNewSchoolForm({...newSchoolForm, email: e.target.value})}
                          placeholder="school@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="school-phone">Phone Number</Label>
                        <Input
                          id="school-phone"
                          value={newSchoolForm.phone}
                          onChange={(e) => setNewSchoolForm({...newSchoolForm, phone: e.target.value})}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <Label htmlFor="school-max-students">Max Students</Label>
                        <Input
                          id="school-max-students"
                          type="number"
                          value={newSchoolForm.maxStudents}
                          onChange={(e) => setNewSchoolForm({...newSchoolForm, maxStudents: parseInt(e.target.value)})}
                          min="1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="school-address">Address</Label>
                      <Input
                        id="school-address"
                        value={newSchoolForm.address}
                        onChange={(e) => setNewSchoolForm({...newSchoolForm, address: e.target.value})}
                        placeholder="123 Education Street, City, State"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={createSchoolMutation.isPending}
                    >
                      {createSchoolMutation.isPending ? "Creating School..." : "Complete School Setup"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>School Analytics</CardTitle>
                <CardDescription>
                  Track your school's coding program performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="text-2xl font-bold text-blue-600">{students.length}</h3>
                    <p className="text-gray-600">Active Students</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="text-2xl font-bold text-green-600">{teachers.length}</h3>
                    <p className="text-gray-600">Teaching Staff</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <h3 className="text-2xl font-bold text-purple-600">
                      {Math.round(((students.length) / (school?.maxStudents || 100)) * 100)}%
                    </h3>
                    <p className="text-gray-600">Capacity Used</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Getting Started</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Create teacher accounts for your coding instructors</li>
                    <li>• Add student accounts for your coding program participants</li>
                    <li>• Monitor student progress and achievements</li>
                    <li>• Track program engagement and completion rates</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}