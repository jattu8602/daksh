'use client'

export function ColorPicker({
  colors,
  selectedColor,
  onColorSelect,
  autoSave,
  onAutoSaveToggle,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">select color</span>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={autoSave}
            onChange={(e) => onAutoSaveToggle(e.target.checked)}
            className="rounded"
          />
          auto save
        </label>
      </div>

      <div className="flex items-center gap-3">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorSelect(color.value)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color.value
                ? 'border-foreground scale-110'
                : 'border-border'
            }`}
            style={{
              backgroundColor: color.value,
              borderColor:
                color.border ||
                (selectedColor === color.value
                  ? 'var(--foreground)'
                  : 'var(--border)'),
            }}
          />
        ))}
      </div>
    </div>
  )
}
