import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ColorPicker } from '@/components/ColorPicker';
import { DEFAULT_GRID_SETTINGS } from '@/types/grid';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { isValidUnit } from '@/utils/grid-calculator';
import { useGridSettings } from '@/hooks/useGridSettings';

export function GridSettings() {
  const { settings, updateSetting, resetSettings, isLoading } = useGridSettings();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasSentInitialSettings, setHasSentInitialSettings] = useState(false);

  const sendMessageToContentScript = (newSettings: typeof settings) => {
    console.log('Popup: Sending message to content script:', newSettings);
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          console.log('Popup: Sending to tab', tabs[0].id);
          chrome.tabs.sendMessage(tabs[0].id, newSettings, (response) => {
            if (chrome.runtime.lastError) {
              console.error('Popup: Error sending message:', chrome.runtime.lastError);
            } else {
              console.log('Popup: Message sent successfully, response:', response);
            }
          });
        } else {
          console.warn('Popup: No active tab found');
        }
      });
    } else {
      console.warn('Popup: Chrome API not available');
    }
  };

  // Send initial settings only once after they are loaded from storage
  useEffect(() => {
    if (!isLoading && !hasSentInitialSettings) {
      console.log('Popup: Settings loaded, sending initial settings:', settings);
      sendMessageToContentScript(settings);
      setHasSentInitialSettings(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const handleTextInputChange = (key: keyof typeof settings, value: string) => {
    if (isValidUnit(value) || value === '') {
      updateSetting(key, value);
      setErrors((prev) => ({ ...prev, [key]: '' }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [key]: 'Input not valid. You must use a valid unit. E.g. ([0-9]+)?px|em|rem',
      }));
    }
  };

  const handleSettingChange = <K extends keyof typeof settings>(
    key: K,
    value: typeof settings[K]
  ) => {
    updateSetting(key, value);
    const newSettings = { ...settings, [key]: value };
    sendMessageToContentScript(newSettings);
  };

  return (
    <div className="w-[360px] bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 z-10 px-6 pt-6 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Pixel Grid</h1>
        <p className="text-sm text-gray-500">Pixel-perfect grid overlay</p>
      </div>

      <div className="px-6 py-4 space-y-6">
        {/* Toggle Grid - iOS Style Switch */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="toggleGrid" className="text-base font-medium text-gray-900">
                Show Grid
              </Label>
              <p className="text-xs text-gray-500 mt-0.5">Toggle grid visibility</p>
            </div>
            <Checkbox
              id="toggleGrid"
              type="switch"
              checked={settings.visible}
              onChange={(e) => handleSettingChange('visible', e.target.checked)}
            />
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-3">
          {/* Dimensions Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Dimensions</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {/* Baseline */}
              <div className="px-4 py-3">
                <Label htmlFor="baseLine" className="text-sm font-medium text-gray-700 block mb-2">
                  Baseline
                </Label>
                <Input
                  id="baseLine"
                  name="baseLine"
                  value={settings.baseLine}
                  onChange={(e) => handleTextInputChange('baseLine', e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value && isValidUnit(e.target.value)) {
                      handleSettingChange('baseLine', e.target.value);
                    }
                  }}
                  className={`w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 transition-colors ${
                    errors.baseLine ? 'border-red-300' : ''
                  }`}
                  placeholder="8px"
                />
                {errors.baseLine && (
                  <p className="text-xs text-red-500 mt-1">{errors.baseLine}</p>
                )}
              </div>

              {/* Inner Column Width */}
              <div className="px-4 py-3">
                <Label htmlFor="innerColumnWidth" className="text-sm font-medium text-gray-700 block mb-2">
                  Inner Column Width
                </Label>
                <Input
                  id="innerColumnWidth"
                  name="innerColumnWidth"
                  value={settings.innerColumnWidth}
                  onChange={(e) => handleTextInputChange('innerColumnWidth', e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value && isValidUnit(e.target.value)) {
                      handleSettingChange('innerColumnWidth', e.target.value);
                    }
                  }}
                  className={`w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 transition-colors ${
                    errors.innerColumnWidth ? 'border-red-300' : ''
                  }`}
                  placeholder="8px"
                />
                {errors.innerColumnWidth && (
                  <p className="text-xs text-red-500 mt-1">{errors.innerColumnWidth}</p>
                )}
              </div>

              {/* Outer Column Width */}
              <div className="px-4 py-3">
                <Label htmlFor="outerColumnWidth" className="text-sm font-medium text-gray-700 block mb-2">
                  Outer Column Width
                </Label>
                <Input
                  id="outerColumnWidth"
                  name="outerColumnWidth"
                  value={settings.outerColumnWidth}
                  onChange={(e) => handleTextInputChange('outerColumnWidth', e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value && isValidUnit(e.target.value)) {
                      handleSettingChange('outerColumnWidth', e.target.value);
                    }
                  }}
                  className={`w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 transition-colors ${
                    errors.outerColumnWidth ? 'border-red-300' : ''
                  }`}
                  placeholder="64px"
                />
                {errors.outerColumnWidth && (
                  <p className="text-xs text-red-500 mt-1">{errors.outerColumnWidth}</p>
                )}
              </div>
            </div>
          </div>

          {/* Appearance Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Appearance</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {/* Grid Color */}
              <div className="px-4 py-4">
                <Label className="text-sm font-medium text-gray-700 block mb-3">
                  Grid Color
                </Label>
                <ColorPicker
                  value={settings.color}
                  onChange={(color) => handleSettingChange('color', color)}
                />
              </div>

              {/* Alpha */}
              <div className="px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="alpha" className="text-sm font-medium text-gray-700">
                    Opacity
                  </Label>
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {settings.alpha}%
                  </span>
                </div>
                <Slider
                  id="alpha"
                  name="alpha"
                  min={0}
                  max={100}
                  value={[settings.alpha]}
                  onValueChange={(value) => handleSettingChange('alpha', value[0])}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Position Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Position</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {/* Offset X */}
              <div className="px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="offsetX" className="text-sm font-medium text-gray-700">
                    Offset X
                  </Label>
                  <span className="text-sm font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                    {settings.offsetX}px
                  </span>
                </div>
                <Slider
                  id="offsetX"
                  name="offsetX"
                  min={0}
                  max={128}
                  value={[settings.offsetX]}
                  onValueChange={(value) => handleSettingChange('offsetX', value[0])}
                  className="w-full"
                />
              </div>

              {/* Offset Y */}
              <div className="px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="offsetY" className="text-sm font-medium text-gray-700">
                    Offset Y
                  </Label>
                  <span className="text-sm font-semibold text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg">
                    {settings.offsetY}px
                  </span>
                </div>
                <Slider
                  id="offsetY"
                  name="offsetY"
                  min={0}
                  max={128}
                  value={[settings.offsetY]}
                  onValueChange={(value) => handleSettingChange('offsetY', value[0])}
                  className="w-full"
                />
              </div>

              {/* Z-Index */}
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="zIndex" className="text-sm font-medium text-gray-700 block">
                      Foreground Mode
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5">Show grid above content</p>
                  </div>
                  <Checkbox
                    id="zIndex"
                    type="switch"
                    checked={settings.zIndex > 0}
                    onChange={(e) =>
                      handleSettingChange('zIndex', e.target.checked ? 100000 : -1)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 pb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Grid not visible?</span>
                <Popover
                  content="Not all pages support displaying the grid in the background. Just switch to foreground."
                  position="above"
                >
                  <button
                    type="button"
                    className="w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs text-gray-600 font-semibold transition-colors"
                  >
                    ?
                  </button>
                </Popover>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetSettings();
                const reset = { ...DEFAULT_GRID_SETTINGS, visible: true };
                sendMessageToContentScript(reset);
              }}
              className="w-full rounded-xl border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 transition-colors"
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
      
      {/* Credit - dezent versteckt */}
      <div className="px-6 py-3 text-center">
        <p className="text-[10px] text-gray-300 opacity-30 hover:opacity-60 transition-opacity">
          by Benjamin Damm
        </p>
      </div>
    </div>
  );
}
