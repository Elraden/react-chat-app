import { useState } from 'react';
import { defaultSettings } from '../../data/mocks';
import type { ModelType, SettingsState } from '../../types';
import Button from '../ui/Button';
import Slider from '../ui/Slider';
import Toggle from '../ui/Toggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type SettingPanelProps = {
    isOpen: boolean;
    onClose: () => void;
    onThemeChange: (theme: "light" | "dark") => void;
}

const SettingsPanel = ({
    isOpen,
    onClose,
    onThemeChange
}: SettingPanelProps) => {
    const [settings, setSettings] = useState<SettingsState>(defaultSettings);

    if (!isOpen) return null;

    const handleReset = () => {
        setSettings(defaultSettings);
        onThemeChange(defaultSettings.theme);
    }

    const handleSave = () => {
        onThemeChange(settings.theme);
        onClose();
    }

    return (
        <div className='settings-overlay' onClick={onClose}>
            <div
                className='settings-panel'
                onClick={(e) => e.stopPropagation()}
                role='dialog'
                aria-modal='true'
                aria-label='Настройки'
            >
                <div className='settings-panel__header'>
                    <h2>Настройки</h2>
                    <button
                        type='button'
                        className='icon-btn'
                        onClick={onClose}
                        aria-label='Закрыть'
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <label className='form-control'>
                    <span>Модель</span>
                    <select
                        value={settings.model}
                        onChange={(e) => setSettings((prev) => ({
                            ...prev,
                            model: e.target.value as ModelType,
                        }))
                        }
                    >
                        <option value="GigaChat">GigaChat</option>
                        <option value="GigaChat-Plus">GigaChat-Plus</option>
                        <option value="GigaChat-Pro">GigaChat-Pro</option>
                        <option value="GigaChat-Max">GigaChat-Max</option>
                    </select>
                </label>
                <Slider
                    label='Temperature'
                    min={0}
                    max={2}
                    step={0.1}
                    value={settings.temperature}
                    onChange={(value) => setSettings((prev) => ({
                        ...prev,
                        temperature: value
                    }))}
                />
                <Slider
                    label='Top-P'
                    min={0}
                    max={1}
                    step={0.1}
                    value={settings.topP}
                    onChange={(value) => setSettings((prev) => ({
                        ...prev,
                        topP: value
                    }))}
                />
                <label className='form-control'>
                    <span>Max Tokens</span>
                    <input type="number"
                        min={1}
                        value={settings.maxTokens}
                        onChange={(e) => setSettings((prev) => ({
                            ...prev, maxTokens: Number(e.target.value)
                        }))}
                    />
                </label>

                <label className='form-control'>
                    <span>System Prompt</span>
                    <textarea rows={5}
                        value={settings.systemPrompt}
                        onChange={(e) => setSettings((prev) => ({
                            ...prev, systemPrompt: e.target.value
                        }))}
                    />
                </label>

                <Toggle
                    checked={settings.theme === 'dark'}
                    onChange={(checked) => {
                        const nextTheme = checked ? "dark" : "light";
                        setSettings((prev) => ({ ...prev, theme: nextTheme }))
                    }}
                    label='Темная тема'
                />

                <div className='settings-panel__actions'>
                    <Button variant='secondary' onClick={handleReset}>
                        Сбросить
                    </Button>
                    <Button variant='primary' onClick={handleSave}>
                        Сохранить
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SettingsPanel