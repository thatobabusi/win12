import { describe, it, expect, beforeEach } from 'vitest';

// NOTE: These are LOGIC tests for the lang()/normalize behaviour, using small
// fixtures. Validation of the ACTUAL translation files (full key parity across
// en/en-US/zh_CN/zh_TW/tn, no empty values, placeholder integrity, no CJK leak)
// lives in tests/unit/lang-files.test.js.

describe('i18n Translation System', () => {
  let mockI18nData;

  beforeEach(() => {
    mockI18nData = {
      en: {
        'setting.name': 'Settings',
        'setting.system': 'System',
        'explorer.thispc': 'This PC',
        'calc.name': 'Calculator',
        'about.name': 'About Win12 Online'
      },
      'zh_CN': {
        'setting.name': '设置',
        'setting.system': '系统',
        'explorer.thispc': '此电脑',
        'calc.name': '计算器',
        'about.name': '关于 Win12 网页版'
      }
    };
  });

  describe('Language key validation', () => {
    it('should validate translation keys match expected format', () => {
      const validKeys = ['setting.name', 'explorer.thispc', 'calc_name'];
      validKeys.forEach(key => {
        expect(key).toBeValidTranslationKey();
      });
    });

    it('should reject invalid key formats', () => {
      const invalidKeys = ['setting name', 'explorer@thispc', 'calc#name'];
      invalidKeys.forEach(key => {
        expect(key).not.toBeValidTranslationKey();
      });
    });
  });

  describe('Language data structure', () => {
    it('should have matching keys between English and Chinese', () => {
      const enKeys = Object.keys(mockI18nData.en).sort();
      const zhKeys = Object.keys(mockI18nData['zh_CN']).sort();
      expect(enKeys).toEqual(zhKeys);
    });

    it('should not have empty translations', () => {
      Object.values(mockI18nData.en).forEach(value => {
        expect(value).toBeTruthy();
        expect(value.length).toBeGreaterThan(0);
      });
    });

    it('should have different values between languages', () => {
      Object.keys(mockI18nData.en).forEach(key => {
        expect(mockI18nData.en[key]).not.toBe(mockI18nData['zh_CN'][key]);
      });
    });
  });

  describe('Language lookup', () => {
    it('should return English translation when language is en', () => {
      const lang = (txt, id) => {
        return mockI18nData.en[id] || txt;
      };
      expect(lang('Default', 'setting.name')).toBe('Settings');
    });

    it('should return Chinese translation when language is zh_CN', () => {
      const lang = (txt, id, langCode = 'zh_CN') => {
        return mockI18nData[langCode]?.[id] || txt;
      };
      expect(lang('Default', 'setting.name', 'zh_CN')).toBe('设置');
    });

    it('should return fallback text when key not found', () => {
      const lang = (txt, id) => {
        return mockI18nData.en[id] || txt;
      };
      expect(lang('Unknown setting', 'nonexistent.key')).toBe('Unknown setting');
    });

    it('should handle multiple lookups', () => {
      const translations = ['setting.name', 'setting.system', 'explorer.thispc'];
      translations.forEach(key => {
        expect(mockI18nData.en[key]).toBeTruthy();
      });
    });
  });

  describe('Language code normalization', () => {
    it('should normalize browser language codes', () => {
      // Mirrors the real langc map in public/src/desktop.js (incl. Setswana).
      const normalize = (code) => ({
        'zh-CN': 'zh_CN',
        'zh-cn': 'zh_CN',
        'zh-TW': 'zh_TW',
        'zh-tw': 'zh_TW',
        'en-US': 'en-US',
        'en-us': 'en-US',
        'en-GB': 'en',
        'en-gb': 'en',
        'tn': 'tn',
        'tn-ZA': 'tn',
        'tn-BW': 'tn'
      }[code] || code);

      expect(normalize('zh-CN')).toBe('zh_CN');
      expect(normalize('en-US')).toBe('en-US');
      expect(normalize('tn-ZA')).toBe('tn');
      expect(normalize('en')).toBe('en');
    });
  });

  describe('Translation completeness', () => {
    it('should have no hardcoded Chinese in English strings', () => {
      const chineseRegex = /[一-鿿]/g;
      Object.entries(mockI18nData.en).forEach(([_key, value]) => {
        const matches = value.match(chineseRegex);
        expect(matches).toBeNull();
      });
    });

    it('should have all common UI strings translated', () => {
      const requiredKeys = [
        'setting.name',
        'setting.system',
        'explorer.thispc',
        'calc.name',
        'about.name'
      ];
      requiredKeys.forEach(key => {
        expect(mockI18nData.en[key]).toBeDefined();
        expect(mockI18nData['zh_CN'][key]).toBeDefined();
      });
    });
  });
});
