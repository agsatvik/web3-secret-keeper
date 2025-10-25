import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWeb3Auth } from "./Web3AuthProvider";
import { Eye, EyeOff, Key } from "lucide-react";

export const SecretsList = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [secrets, setSecrets] = useState<Record<string, string>>({});
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  const { getAllSecrets } = useWeb3Auth();

  useEffect(() => {
    loadSecrets();
  }, [refreshTrigger]);

  const loadSecrets = async () => {
    const allSecrets = await getAllSecrets();
    setSecrets(allSecrets);
  };

  const toggleVisibility = (key: string) => {
    setVisibleSecrets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-xl border-border/50">
      <div className="flex items-center gap-2 mb-6">
        <Key className="w-5 h-5 text-secondary" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
          Your Secrets
        </h2>
      </div>
      {Object.keys(secrets).length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No secrets stored yet</p>
      ) : (
        <div className="space-y-3">
          {Object.entries(secrets).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{key}</p>
                <p className="text-sm text-muted-foreground font-mono truncate">
                  {visibleSecrets.has(key) ? value : "•".repeat(20)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleVisibility(key)}
                className="ml-4"
              >
                {visibleSecrets.has(key) ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
