import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    CheckCircle,
    Eye,
    EyeOff,
    Loader2,
    Save,
    Server,
    ShieldCheck,
    XCircle
} from "lucide-react";

interface PixelData {
  fb_pixel_enabled: boolean;
  fb_pixel_id: string;
  fb_pixel_test_event_code: string;
  cookie_consent_enabled: boolean;
  fb_capi_enabled: boolean;
  fb_capi_dataset_id: string;
  fb_capi_test_event_code: string;
  fb_capi_api_version: string;
}

interface Props {
  pixelData: PixelData;
  setPixelData: (data: PixelData) => void;
  // Pixel test
  isTestingPixel: boolean;
  pixelTestResult: "success" | "error" | null;
  onTestPixel: () => void;
  setPixelTestResult: (result: "success" | "error" | null) => void;
  // CAPI token
  capiToken: string;
  setCapiToken: (val: string) => void;
  capiTokenMasked: string | null;
  hasCapiToken: boolean;
  isSavingToken: boolean;
  showTokenInput: boolean;
  setShowTokenInput: (val: boolean) => void;
  showTokenValue: boolean;
  setShowTokenValue: (val: boolean) => void;
  tokenLastUpdated: string | null;
  onSaveToken: () => void;
  // CAPI test
  isTestingCapi: boolean;
  capiTestResult: { success: boolean; message: string } | null;
  onTestCapi: () => void;
  // form
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

const TRACKED_EVENTS = [
  { name: "PageView", desc: "Every page load" },
  { name: "ViewContent", desc: "Product page views" },
  { name: "AddToCart", desc: "Add to cart clicks" },
  { name: "InitiateCheckout", desc: "Checkout page load" },
  { name: "Purchase", desc: "Successful orders" },
  { name: "Search", desc: "Product searches" },
];

export function MarketingSettingsTab({
  pixelData,
  setPixelData,
  isTestingPixel,
  pixelTestResult,
  onTestPixel,
  setPixelTestResult,
  capiToken,
  setCapiToken,
  capiTokenMasked,
  hasCapiToken,
  isSavingToken,
  showTokenInput,
  setShowTokenInput,
  showTokenValue,
  setShowTokenValue,
  tokenLastUpdated,
  onSaveToken,
  isTestingCapi,
  capiTestResult,
  onTestCapi,
  onSubmit,
  isPending,
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Facebook Pixel */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="h-5 w-5 text-[#1877F2]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <h2 className="text-lg font-semibold">Facebook Pixel</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Facebook Pixel</p>
              <p className="text-sm text-muted-foreground">
                Track page views, add to cart, and purchase events
              </p>
            </div>
            <Switch
              checked={pixelData.fb_pixel_enabled}
              onCheckedChange={(checked) =>
                setPixelData({ ...pixelData, fb_pixel_enabled: checked })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Facebook Pixel ID <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pixelData.fb_pixel_id}
                onChange={(e) => {
                  setPixelData({
                    ...pixelData,
                    fb_pixel_id: e.target.value.replace(/\D/g, ""),
                  });
                  setPixelTestResult(null);
                }}
                className="input-shop flex-1"
                placeholder="123456789012345"
                maxLength={20}
              />
              <Button
                type="button"
                variant="outline"
                onClick={onTestPixel}
                disabled={isTestingPixel || !pixelData.fb_pixel_id}
              >
                {isTestingPixel ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : pixelTestResult === "success" ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : pixelTestResult === "error" ? (
                  <XCircle className="h-4 w-4 text-destructive" />
                ) : (
                  "Validate"
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Enter your Pixel ID (10-20 digits). Find it in Facebook Events
              Manager.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Test Event Code (Optional)
            </label>
            <input
              type="text"
              value={pixelData.fb_pixel_test_event_code}
              onChange={(e) =>
                setPixelData({
                  ...pixelData,
                  fb_pixel_test_event_code: e.target.value,
                })
              }
              className="input-shop"
              placeholder="TEST12345"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use this for testing events in Facebook's Test Events tool
            </p>
          </div>
        </div>
      </div>

      {/* Conversion API */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Server className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">
            Conversion API (Server-Side)
          </h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Conversion API</p>
              <p className="text-sm text-muted-foreground">
                Send events server-side for improved tracking accuracy and
                reliability
              </p>
            </div>
            <Switch
              checked={pixelData.fb_capi_enabled}
              onCheckedChange={(checked) =>
                setPixelData({ ...pixelData, fb_capi_enabled: checked })
              }
            />
          </div>

          {pixelData.fb_capi_enabled && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Dataset ID
                </label>
                <input
                  type="text"
                  value={pixelData.fb_capi_dataset_id}
                  onChange={(e) =>
                    setPixelData({
                      ...pixelData,
                      fb_capi_dataset_id: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="input-shop"
                  placeholder="Same as Pixel ID (leave blank to use Pixel ID)"
                  maxLength={20}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Usually the same as your Pixel ID. Leave blank to use the
                  Pixel ID above.
                </p>
              </div>

              {/* Access Token */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <ShieldCheck className="h-4 w-4 inline mr-1" />
                  CAPI Access Token{" "}
                  <span className="text-destructive">*</span>
                </label>

                {hasCapiToken && !showTokenInput ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                      <ShieldCheck className="h-5 w-5 text-green-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-700">
                          Token configured
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {capiTokenMasked}
                        </p>
                        {tokenLastUpdated && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Updated:{" "}
                            {new Date(tokenLastUpdated).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTokenInput(true)}
                      >
                        Update
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      🔒 Token is stored securely and never exposed to the
                      browser.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          type={showTokenValue ? "text" : "password"}
                          value={capiToken}
                          onChange={(e) => setCapiToken(e.target.value)}
                          placeholder="Paste your CAPI access token here"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowTokenValue(!showTokenValue)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showTokenValue ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <Button
                        type="button"
                        onClick={onSaveToken}
                        disabled={isSavingToken || !capiToken.trim()}
                      >
                        {isSavingToken ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        <span className="ml-2">
                          {isSavingToken ? "Saving..." : "Save Token"}
                        </span>
                      </Button>
                    </div>
                    {hasCapiToken && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowTokenInput(false);
                          setCapiToken("");
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground">
                      🔒 Token will be stored securely server-side. Generate it
                      from Meta Events Manager → Settings → Conversions API.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  CAPI Test Event Code (Optional)
                </label>
                <input
                  type="text"
                  value={pixelData.fb_capi_test_event_code}
                  onChange={(e) =>
                    setPixelData({
                      ...pixelData,
                      fb_capi_test_event_code: e.target.value,
                    })
                  }
                  className="input-shop"
                  placeholder="TEST12345"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Events with this code appear in Facebook's Test Events tool
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  API Version
                </label>
                <input
                  type="text"
                  value={pixelData.fb_capi_api_version}
                  onChange={(e) =>
                    setPixelData({
                      ...pixelData,
                      fb_capi_api_version: e.target.value,
                    })
                  }
                  className="input-shop"
                  placeholder="v20.0"
                />
              </div>

              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onTestCapi}
                  disabled={isTestingCapi}
                >
                  {isTestingCapi ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Server className="h-4 w-4 mr-2" />
                  )}
                  Send Test Event
                </Button>
                {capiTestResult && (
                  <div
                    className={`mt-2 flex items-center gap-2 text-sm ${capiTestResult.success ? "text-green-600" : "text-destructive"}`}
                  >
                    {capiTestResult.success ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    {capiTestResult.message}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cookie Consent */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="h-5 w-5 text-accent"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
            <path d="M8.5 8.5v.01" />
            <path d="M16 15.5v.01" />
            <path d="M12 12v.01" />
            <path d="M11 17v.01" />
            <path d="M7 14v.01" />
          </svg>
          <h2 className="text-lg font-semibold">Cookie Consent (GDPR)</h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Require Cookie Consent</p>
            <p className="text-sm text-muted-foreground">
              Show a cookie banner and only load pixel after user accepts
            </p>
          </div>
          <Switch
            checked={pixelData.cookie_consent_enabled}
            onCheckedChange={(checked) =>
              setPixelData({ ...pixelData, cookie_consent_enabled: checked })
            }
          />
        </div>
      </div>

      {/* Events Tracked */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-medium mb-4">Events Tracked Automatically</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TRACKED_EVENTS.map((event) => (
            <div
              key={event.name}
              className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
            >
              <CheckCircle className="h-4 w-4 text-success shrink-0" />
              <div>
                <p className="text-sm font-medium">{event.name}</p>
                <p className="text-xs text-muted-foreground">{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="btn-accent" disabled={isPending}>
          <Save className="h-4 w-4 mr-2" />
          {isPending ? "Saving..." : "Save Marketing Settings"}
        </Button>
      </div>
    </form>
  );
}
