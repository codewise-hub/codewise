import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Search, Link } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

interface ParentChildLinkingProps {
  parentUserId: string;
  onLinkingComplete: () => void;
}

export function ParentChildLinking({ parentUserId, onLinkingComplete }: ParentChildLinkingProps) {
  const [childEmail, setChildEmail] = useState("");
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [searchError, setSearchError] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const searchStudentMutation = useMutation({
    mutationFn: async (email: string) => {
      return await apiRequest(`/api/users/search-student?email=${encodeURIComponent(email)}`);
    },
    onSuccess: (data: any) => {
      if (data.user) {
        setSearchResult(data.user);
        setSearchError("");
      } else {
        setSearchResult(null);
        setSearchError("No student account found with this email address.");
      }
    },
    onError: (error) => {
      setSearchResult(null);
      setSearchError("Failed to search for student. Please try again.");
    },
  });

  const linkChildMutation = useMutation({
    mutationFn: async (childUserId: string) => {
      return await apiRequest("/api/parent-child-relations", "POST", {
        parentUserId,
        childUserId,
        relationshipType: "parent",
      });
    },
    onSuccess: () => {
      toast({
        title: "Child Linked Successfully",
        description: `You are now connected to ${searchResult?.name}'s account.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/parent-child-relations"] });
      onLinkingComplete();
    },
    onError: (error) => {
      toast({
        title: "Linking Failed",
        description: "Failed to link child account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    if (!childEmail.trim()) {
      setSearchError("Please enter a valid email address.");
      return;
    }
    
    if (!childEmail.includes("@")) {
      setSearchError("Please enter a valid email address.");
      return;
    }

    searchStudentMutation.mutate(childEmail.trim());
  };

  const handleLinkChild = () => {
    if (searchResult) {
      linkChildMutation.mutate(searchResult.id);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <Users className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Link Your Child's Account
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Connect to your child's existing student account to monitor their progress
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Student Account
          </CardTitle>
          <CardDescription>
            Enter your child's email address to search for their existing account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="child-email">Child's Email Address</Label>
            <div className="flex gap-2">
              <Input
                id="child-email"
                type="email"
                placeholder="child@example.com"
                value={childEmail}
                onChange={(e) => setChildEmail(e.target.value)}
                disabled={searchStudentMutation.isPending}
                data-testid="input-child-email"
              />
              <Button
                onClick={handleSearch}
                disabled={searchStudentMutation.isPending || !childEmail.trim()}
                data-testid="button-search-student"
              >
                {searchStudentMutation.isPending ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          {searchError && (
            <Alert variant="destructive">
              <AlertDescription>{searchError}</AlertDescription>
            </Alert>
          )}

          {searchResult && (
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200">
                      Student Found!
                    </h3>
                    <p className="text-green-600 dark:text-green-400">
                      Name: {searchResult.name}
                    </p>
                    <p className="text-green-600 dark:text-green-400">
                      Age Group: {searchResult.ageGroup || 'Not specified'}
                    </p>
                    <p className="text-green-600 dark:text-green-400">
                      Grade: {searchResult.grade || 'Not specified'}
                    </p>
                  </div>
                  <Button
                    onClick={handleLinkChild}
                    disabled={linkChildMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                    data-testid="button-link-child"
                  >
                    {linkChildMutation.isPending ? (
                      "Linking..."
                    ) : (
                      <>
                        <Link className="h-4 w-4 mr-2" />
                        Link Account
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          <strong>Note:</strong> Your child must have an existing student account for you to link to it. 
          If they don't have an account yet, they should create one first by selecting "Student" 
          during registration.
        </AlertDescription>
      </Alert>

      <div className="text-center">
        <Button
          variant="outline"
          onClick={onLinkingComplete}
          data-testid="button-skip-linking"
        >
          Skip for Now
        </Button>
      </div>
    </div>
  );
}