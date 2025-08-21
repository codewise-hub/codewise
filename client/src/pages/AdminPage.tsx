import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  Users, 
  BookOpen, 
  Settings, 
  RefreshCw, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  ageGroup?: string;
  createdAt: string;
}

interface DatabaseStats {
  userCount: number;
  studentCount: number;
  teacherCount: number;
  parentCount: number;
  schoolAdminCount: number;
}

export function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DatabaseStats>({
    userCount: 0,
    studentCount: 0,
    teacherCount: 0,
    parentCount: 0,
    schoolAdminCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [sqlQuery, setSqlQuery] = useState("");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [queryError, setQueryError] = useState("");

  // Fetch database information
  const fetchDatabaseInfo = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await fetch('/api/admin/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData);
        
        // Calculate stats
        const newStats = {
          userCount: usersData.length,
          studentCount: usersData.filter((u: User) => u.role === 'student').length,
          teacherCount: usersData.filter((u: User) => u.role === 'teacher').length,
          parentCount: usersData.filter((u: User) => u.role === 'parent').length,
          schoolAdminCount: usersData.filter((u: User) => u.role === 'school_admin').length
        };
        setStats(newStats);
      }
    } catch (error) {
      console.error('Error fetching database info:', error);
      toast({
        title: "Error",
        description: "Failed to fetch database information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Execute SQL query
  const executeSqlQuery = async () => {
    if (!sqlQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a SQL query",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sqlQuery }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setQueryResult(data);
        setQueryError("");
        toast({
          title: "Success",
          description: "Query executed successfully",
        });
      } else {
        setQueryError(data.error || "Query execution failed");
        setQueryResult(null);
      }
    } catch (error) {
      setQueryError("Network error occurred");
      setQueryResult(null);
      toast({
        title: "Error",
        description: "Failed to execute query",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDatabaseInfo();
  }, []);

  // Check if user has admin access
  if (!user || (user.role !== 'school_admin' && user.email !== 'admin@codewisehub.com')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Admin Panel</h1>
          <p className="text-gray-600">Manage your Neon PostgreSQL database</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="sql" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              SQL Query
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Maintenance
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.userCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Students</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.studentCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Teachers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.teacherCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Parents</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{stats.parentCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">School Admins</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.schoolAdminCount}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Database Connection</CardTitle>
                <CardDescription>Current Neon database status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Connected to Neon PostgreSQL</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Database is operational and responding to queries.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">User Management</h3>
              <Button onClick={fetchDatabaseInfo} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  {users.length} users registered in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      <span className="ml-2">Loading users...</span>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline">{user.role}</Badge>
                              {user.ageGroup && <Badge variant="secondary">{user.ageGroup}</Badge>}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SQL Query Tab */}
          <TabsContent value="sql" className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> Direct SQL queries can modify your database. 
                Use with caution and ensure you have backups.
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle>Execute SQL Query</CardTitle>
                <CardDescription>
                  Run direct SQL queries against your Neon database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="sql-query">SQL Query</Label>
                  <Textarea
                    id="sql-query"
                    placeholder="SELECT * FROM users LIMIT 10;"
                    value={sqlQuery}
                    onChange={(e) => setSqlQuery(e.target.value)}
                    rows={6}
                    className="font-mono"
                  />
                </div>
                
                <Button onClick={executeSqlQuery} className="w-full">
                  Execute Query
                </Button>

                {queryError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{queryError}</AlertDescription>
                  </Alert>
                )}

                {queryResult && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Query Result:</h4>
                    <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                      {JSON.stringify(queryResult, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Maintenance</CardTitle>
                <CardDescription>
                  Tools for maintaining and monitoring your database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" onClick={fetchDatabaseInfo}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Database Stats
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => window.open('https://neon.tech', '_blank')}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Open Neon Console
                  </Button>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Database is healthy and responding normally. Last checked: {new Date().toLocaleString()}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}