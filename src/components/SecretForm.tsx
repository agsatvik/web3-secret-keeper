import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useWeb3Auth } from "./Web3AuthProvider";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export const SecretForm = ({ onSecretStored }: { onSecretStored: () => void }) => {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const { storeSecret } = useWeb3Auth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key || !value) {
      toast.error("Please fill in both fields");
      return;
    }

    setIsLoading(true);
    try {
      await storeSecret(key, value);
      toast.success("Secret stored successfully!");
      setKey("");
      setValue("");
      onSecretStored();
    } catch (error) {
      toast.error("Failed to store secret");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-xl border-border/50">
      <div className="flex items-center gap-2 mb-6">
        <Lock className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Store Secret
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="key">Secret Key</Label>
          <Input
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="e.g., api_key"
            className="bg-muted/30 border-border/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="value">Secret Value</Label>
          <Input
            id="value"
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter secret value"
            className="bg-muted/30 border-border/50"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
          disabled={isLoading}
        >
          {isLoading ? "Storing..." : "Store Secret"}
        </Button>
      </form>
    </Card>
  );
};
