import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Save, Upload, Download, Trash2, Ship, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ShipGeometry } from "@/types/hydrostatic";

interface StabilityProfile {
  id: string;
  name: string;
  description?: string;
  geometry: ShipGeometry;
  kg: number;
  created: number;
  modified: number;
}

interface ProfileManagerProps {
  currentGeometry: ShipGeometry;
  currentKG: number;
  onLoadProfile: (geometry: ShipGeometry, kg: number) => void;
}

export const StabilityProfileManager: React.FC<ProfileManagerProps> = ({
  currentGeometry,
  currentKG,
  onLoadProfile
}) => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<StabilityProfile[]>([]);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileDesc, setNewProfileDesc] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Load profiles from localStorage on mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem('stabilityProfiles');
    if (savedProfiles) {
      try {
        setProfiles(JSON.parse(savedProfiles));
      } catch (error) {
        toast({
          title: "Error Loading Profiles",
          description: "Failed to load saved profiles",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  // Save profiles to localStorage whenever profiles change
  useEffect(() => {
    localStorage.setItem('stabilityProfiles', JSON.stringify(profiles));
  }, [profiles]);

  const saveCurrentProfile = useCallback(() => {
    if (!newProfileName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a profile name",
        variant: "destructive"
      });
      return;
    }

    const newProfile: StabilityProfile = {
      id: Date.now().toString(),
      name: newProfileName.trim(),
      description: newProfileDesc.trim(),
      geometry: { ...currentGeometry },
      kg: currentKG,
      created: Date.now(),
      modified: Date.now()
    };

    setProfiles(prev => [...prev, newProfile]);
    setNewProfileName('');
    setNewProfileDesc('');
    setIsCreateDialogOpen(false);

    toast({
      title: "Profile Saved",
      description: `Profile "${newProfile.name}" saved successfully`
    });
  }, [currentGeometry, currentKG, newProfileName, newProfileDesc, toast]);

  const loadProfile = useCallback((profile: StabilityProfile) => {
    onLoadProfile(profile.geometry, profile.kg);
    toast({
      title: "Profile Loaded",
      description: `Loaded profile "${profile.name}"`
    });
  }, [onLoadProfile, toast]);

  const deleteProfile = useCallback((profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    
    if (profile) {
      toast({
        title: "Profile Deleted",
        description: `Deleted profile "${profile.name}"`
      });
    }
  }, [profiles, toast]);

  const exportProfile = useCallback((profile: StabilityProfile) => {
    const exportData = {
      ...profile,
      exportedAt: new Date().toISOString(),
      exportedBy: 'Maritime Calculator'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name.replace(/[^a-z0-9]/gi, '_')}_profile.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Profile Exported",
      description: `Exported "${profile.name}" to JSON file`
    });
  }, [toast]);

  const importProfile = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedProfile = JSON.parse(e.target?.result as string);
        
        // Validate profile structure
        if (!importedProfile.name || !importedProfile.geometry || importedProfile.kg === undefined) {
          throw new Error('Invalid profile format');
        }

        const newProfile: StabilityProfile = {
          ...importedProfile,
          id: Date.now().toString(),
          modified: Date.now(),
          name: `${importedProfile.name} (Imported)`
        };

        setProfiles(prev => [...prev, newProfile]);
        
        toast({
          title: "Profile Imported",
          description: `Imported profile "${newProfile.name}"`
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid profile file format",
          variant: "destructive"
        });
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset input
  }, [toast]);

  const loadExampleProfiles = useCallback(() => {
    const examples: StabilityProfile[] = [
      {
        id: 'example_container',
        name: 'Container Ship - 175m',
        description: 'Large container vessel with standard dimensions',
        geometry: {
          length: 175,
          breadth: 28.5,
          depth: 14.2,
          draft: 9.8,
          blockCoefficient: 0.78,
          waterplaneCoefficient: 0.88,
          midshipCoefficient: 0.995,
          prismaticCoefficient: 0.784,
          verticalPrismaticCoefficient: 0.87
        },
        kg: 7.2,
        created: Date.now(),
        modified: Date.now()
      },
      {
        id: 'example_bulk',
        name: 'Bulk Carrier - 200m',
        description: 'Cape-size bulk carrier',
        geometry: {
          length: 200,
          breadth: 32,
          depth: 18,
          draft: 14.5,
          blockCoefficient: 0.85,
          waterplaneCoefficient: 0.89,
          midshipCoefficient: 0.998,
          prismaticCoefficient: 0.852,
          verticalPrismaticCoefficient: 0.89
        },
        kg: 9.8,
        created: Date.now(),
        modified: Date.now()
      },
      {
        id: 'example_tanker',
        name: 'Oil Tanker - 230m',
        description: 'VLCC oil tanker',
        geometry: {
          length: 230,
          breadth: 42,
          depth: 21,
          draft: 16.2,
          blockCoefficient: 0.82,
          waterplaneCoefficient: 0.85,
          midshipCoefficient: 0.995,
          prismaticCoefficient: 0.824,
          verticalPrismaticCoefficient: 0.86
        },
        kg: 11.5,
        created: Date.now(),
        modified: Date.now()
      }
    ];

    // Add examples that don't already exist
    const existingIds = new Set(profiles.map(p => p.id));
    const newExamples = examples.filter(ex => !existingIds.has(ex.id));
    
    if (newExamples.length > 0) {
      setProfiles(prev => [...prev, ...newExamples]);
      toast({
        title: "Example Profiles Added",
        description: `Added ${newExamples.length} example profiles`
      });
    } else {
      toast({
        title: "Examples Already Loaded",
        description: "Example profiles are already available"
      });
    }
  }, [profiles, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ship className="h-5 w-5" />
          Ship Profile Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Current
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Current Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="profileName">Profile Name</Label>
                  <Input
                    id="profileName"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="Enter profile name..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profileDesc">Description (Optional)</Label>
                  <Input
                    id="profileDesc"
                    value={newProfileDesc}
                    onChange={(e) => setNewProfileDesc(e.target.value)}
                    placeholder="Brief description..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveCurrentProfile}>
                    Save Profile
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={loadExampleProfiles}>
            Load Examples
          </Button>

          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={importProfile}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import Profile
            </Button>
          </div>
        </div>

        {/* Profiles List */}
        {profiles.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-medium">Saved Profiles ({profiles.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{profile.name}</div>
                    {profile.description && (
                      <div className="text-sm text-muted-foreground">
                        {profile.description}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      L: {profile.geometry.length}m, B: {profile.geometry.breadth}m, 
                      T: {profile.geometry.draft}m, KG: {profile.kg}m
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(profile.created).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => loadProfile(profile)}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportProfile(profile)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteProfile(profile.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              No saved profiles yet. Save your current configuration or load example profiles to get started.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};