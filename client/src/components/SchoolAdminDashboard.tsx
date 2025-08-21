import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, GraduationCap, School, Settings, BarChart3, Edit, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AuthUser } from "@/types/user";

interface SchoolAdminDashboardProps {
  user: AuthUser;
}

interface SchoolUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
  ageGroup?: string;
  grade?: string;
  subjects?: string;
  assignedTeacher?: string;
  isActive: boolean;
  createdAt: Date;
}

interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  maxStudents: number;
  currentStudents: number;
  packageId: string;
  subscriptionStatus: string;
}

export function SchoolAdminDashboard({ user }: SchoolAdminDashboardProps) {
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "" as 'student' | 'teacher',
    grade: "",
    ageGroup: "",
    subjects: "",
  });
  const [assignmentForm, setAssignmentForm] = useState({
    studentId: "",
    teacherId: "",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get school information - demo data
  const { data: school } = useQuery<School>({
    queryKey: ["/api/schools", "demo"],
    queryFn: async () => ({
      id: "demo-school-id",
      name: "CodewiseHub Demo School",
      address: "123 Education Avenue, Cape Town, South Africa",
      phone: "+27 21 123 4567",
      email: "admin@demoschool.edu",
      maxStudents: 200,
      currentStudents: 45,
      packageId: "school_standard",
      subscriptionStatus: "active",
    }),
  });

  // Get school users with demo data
  const { data: schoolUsers, isLoading: usersLoading } = useQuery<SchoolUser[]>({
    queryKey: ["/api/schools", "demo", "users"],
    queryFn: async () => [
      {
        id: "teacher-1",
        email: "sarah.johnson@demoschool.edu",
        name: "Sarah Johnson",
        role: "teacher" as const,
        subjects: "Mathematics, Computer Science",
        isActive: true,
        createdAt: new Date("2024-01-15"),
      },
      {
        id: "teacher-2",
        email: "mike.wilson@demoschool.edu", 
        name: "Mike Wilson",
        role: "teacher" as const,
        subjects: "Science, Robotics",
        isActive: true,
        createdAt: new Date("2024-02-01"),
      },
      {
        id: "student-1",
        email: "alex.smith@demoschool.edu",
        name: "Alex Smith",
        role: "student" as const,
        ageGroup: "12-17",
        grade: "Grade 8",
        assignedTeacher: "teacher-1",
        isActive: true,
        createdAt: new Date("2024-02-15"),
      },
      {
        id: "student-2",
        email: "emma.davis@demoschool.edu",
        name: "Emma Davis",
        role: "student" as const,
        ageGroup: "6-11",
        grade: "Grade 5",
        assignedTeacher: "teacher-2",
        isActive: true,
        createdAt: new Date("2024-03-01"),
      },
      {
        id: "student-3",
        email: "john.parker@demoschool.edu",
        name: "John Parker",
        role: "student" as const,
        ageGroup: "12-17",
        grade: "Grade 9",
        assignedTeacher: "teacher-1",
        isActive: true,
        createdAt: new Date("2024-03-10"),
      }
    ],
  });

  // Create new user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof newUserForm) => {
      const newUser: SchoolUser = {
        id: `${userData.role}-${Date.now()}`,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        ageGroup: userData.ageGroup || undefined,
        grade: userData.grade || undefined,
        subjects: userData.subjects || undefined,
        isActive: true,
        createdAt: new Date(),
      };
      return newUser;
    },
    onSuccess: () => {
      toast({
        title: "User Created",
        description: "New user has been successfully created.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/schools", "demo", "users"],
      });
      setNewUserForm({
        name: "",
        email: "",
        password: "",
        role: "" as 'student' | 'teacher',
        grade: "",
        ageGroup: "",
        subjects: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Assign student to teacher mutation
  const assignStudentMutation = useMutation({
    mutationFn: async (assignment: typeof assignmentForm) => {
      return { studentId: assignment.studentId, teacherId: assignment.teacherId };
    },
    onSuccess: () => {
      toast({
        title: "Assignment Updated",
        description: "Student has been assigned to teacher successfully.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/schools", "demo", "users"],
      });
      setAssignmentForm({ studentId: "", teacherId: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to assign student. Please try again.",
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

  const handleAssignStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentForm.studentId || !assignmentForm.teacherId) {
      toast({
        title: "Missing Information",
        description: "Please select both student and teacher.",
        variant: "destructive",
      });
      return;
    }
    assignStudentMutation.mutate(assignmentForm);
  };

  const students = schoolUsers?.filter(u => u.role === 'student') || [];
  const teachers = schoolUsers?.filter(u => u.role === 'teacher') || [];

  const getTeacherName = (teacherId?: string) => {
    if (!teacherId) return "Unassigned";
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : "Unknown Teacher";
  };

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
                            <p className="font-medium">{teacher.name}</p>
                            <p className="text-sm text-gray-600">{teacher.email}</p>
                            {teacher.subjects && (
                              <p className="text-sm text-blue-600">Subjects: {teacher.subjects}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">Teacher</Badge>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Students ({students.length})</h3>
                    <div className="grid gap-3">
                      {students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.email}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              {student.grade && (
                                <Badge variant="outline">{student.grade}</Badge>
                              )}
                              {student.ageGroup && (
                                <Badge variant="outline">Ages {student.ageGroup}</Badge>
                              )}
                              <p className="text-sm text-green-600">
                                Teacher: {getTeacherName(student.assignedTeacher)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">Student</Badge>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create User Tab */}
          <TabsContent value="create-user" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create User Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New User</CardTitle>
                  <CardDescription>
                    Add new students or teachers to your school
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newUserForm.name}
                        onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                        placeholder="Enter full name"
                        required
                        data-testid="input-user-name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                        placeholder="Enter email address"
                        required
                        data-testid="input-user-email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Temporary Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUserForm.password}
                        onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                        placeholder="Enter temporary password"
                        required
                        data-testid="input-user-password"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newUserForm.role}
                        onValueChange={(value: 'student' | 'teacher') => 
                          setNewUserForm({...newUserForm, role: value})}
                      >
                        <SelectTrigger data-testid="select-user-role">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="teacher">Teacher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newUserForm.role === 'student' && (
                      <>
                        <div>
                          <Label htmlFor="ageGroup">Age Group</Label>
                          <Select
                            value={newUserForm.ageGroup}
                            onValueChange={(value) => setNewUserForm({...newUserForm, ageGroup: value})}
                          >
                            <SelectTrigger data-testid="select-age-group">
                              <SelectValue placeholder="Select age group" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="6-11">Young Coders (6-11)</SelectItem>
                              <SelectItem value="12-17">Teen Coders (12-17)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="grade">Grade</Label>
                          <Input
                            id="grade"
                            value={newUserForm.grade}
                            onChange={(e) => setNewUserForm({...newUserForm, grade: e.target.value})}
                            placeholder="e.g., Grade 8"
                            data-testid="input-student-grade"
                          />
                        </div>
                      </>
                    )}

                    {newUserForm.role === 'teacher' && (
                      <div>
                        <Label htmlFor="subjects">Subjects</Label>
                        <Input
                          id="subjects"
                          value={newUserForm.subjects}
                          onChange={(e) => setNewUserForm({...newUserForm, subjects: e.target.value})}
                          placeholder="e.g., Mathematics, Computer Science"
                          data-testid="input-teacher-subjects"
                        />
                      </div>
                    )}
                    
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createUserMutation.isPending}
                      data-testid="button-create-user"
                    >
                      {createUserMutation.isPending ? (
                        "Creating..."
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Create User
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Assign Students to Teachers */}
              <Card>
                <CardHeader>
                  <CardTitle>Assign Student to Teacher</CardTitle>
                  <CardDescription>
                    Manage student-teacher assignments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAssignStudent} className="space-y-4">
                    <div>
                      <Label htmlFor="student">Select Student</Label>
                      <Select
                        value={assignmentForm.studentId}
                        onValueChange={(value) => setAssignmentForm({...assignmentForm, studentId: value})}
                      >
                        <SelectTrigger data-testid="select-assign-student">
                          <SelectValue placeholder="Choose a student" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id}>
                              {student.name} ({student.grade || student.ageGroup})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="teacher">Select Teacher</Label>
                      <Select
                        value={assignmentForm.teacherId}
                        onValueChange={(value) => setAssignmentForm({...assignmentForm, teacherId: value})}
                      >
                        <SelectTrigger data-testid="select-assign-teacher">
                          <SelectValue placeholder="Choose a teacher" />
                        </SelectTrigger>
                        <SelectContent>
                          {teachers.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name} ({teacher.subjects})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={assignStudentMutation.isPending}
                      data-testid="button-assign-student"
                    >
                      {assignStudentMutation.isPending ? (
                        "Assigning..."
                      ) : (
                        "Assign Student"
                      )}
                    </Button>
                  </form>

                  {/* Current Assignments */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Current Assignments</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {students.filter(s => s.assignedTeacher).map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{student.name}</span>
                          <span className="text-sm text-gray-600">→ {getTeacherName(student.assignedTeacher)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* School Settings Tab */}
          <TabsContent value="school" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>School Information</CardTitle>
                <CardDescription>
                  Manage your school details and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">School Name</Label>
                      <p className="text-lg font-semibold">{school?.name}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Address</Label>
                      <p className="text-gray-800">{school?.address}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Contact</Label>
                      <div className="space-y-1">
                        <p className="text-gray-800 flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          {school?.email}
                        </p>
                        <p className="text-gray-800 flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {school?.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Package</Label>
                      <Badge variant="outline" className="text-lg">
                        {school?.packageId === 'school_standard' ? 'School Standard' : 'School Enterprise'}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Capacity</Label>
                      <p className="text-lg font-semibold">
                        {school?.currentStudents || students.length} / {school?.maxStudents} students
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Status</Label>
                      <Badge className="bg-green-100 text-green-800">
                        {school?.subscriptionStatus || "Active"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit School Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Users</span>
                      <span className="font-semibold">{schoolUsers?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Students</span>
                      <span className="font-semibold">{students.filter(s => s.isActive).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Teachers</span>
                      <span className="font-semibold">{teachers.filter(t => t.isActive).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Assigned Students</span>
                      <span className="font-semibold">{students.filter(s => s.assignedTeacher).length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Age Group Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Young Coders (6-11)</span>
                      <span className="font-semibold">
                        {students.filter(s => s.ageGroup === '6-11').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Teen Coders (12-17)</span>
                      <span className="font-semibold">
                        {students.filter(s => s.ageGroup === '12-17').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}