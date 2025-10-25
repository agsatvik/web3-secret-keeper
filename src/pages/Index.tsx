import { useState } from "react";
import { useWeb3Auth } from "@/components/Web3AuthProvider";
import { Button } from "@/components/ui/button";
import { SecretForm } from "@/components/SecretForm";
import { SecretsList } from "@/components/SecretsList";
import { Shield, LogOut } from "lucide-react";

const Index = () => {
  const { isAuthenticated, user, login, logout } = useWeb3Auth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSecretStored = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-md">
          <div className="flex justify-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-xl border border-primary/20">
              <Shield className="w-16 h-16 text-primary" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
              Web3Auth Secrets
            </h1>
            <p className="text-muted-foreground text-lg">
              Securely store and manage your secrets with Web3 authentication
            </p>
          </div>
          <Button
            onClick={login}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all transform hover:scale-105 shadow-lg hover:shadow-primary/50"
          >
            <Shield className="mr-2 w-5 h-5" />
            Connect with Web3Auth
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-xl border border-primary/20">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Web3Auth Secrets
              </h1>
              {user && (
                <p className="text-sm text-muted-foreground">
                  {user.email || user.name || "Connected"}
                </p>
              )}
            </div>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="border-border/50 hover:border-destructive/50 hover:text-destructive"
          >
            <LogOut className="mr-2 w-4 h-4" />
            Disconnect
          </Button>
        </header>

        <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
          <SecretForm onSecretStored={handleSecretStored} />
          <SecretsList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Index;
