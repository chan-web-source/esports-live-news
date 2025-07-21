type Listener = () => void;

class OddsStore {
    private selectedOddsType: string = 'decimal';
    private listeners: Listener[] = [];

    getSelectedOddsType(): string {
        console.log('[OddsStore] - Getting odds type:', this.selectedOddsType);
        return this.selectedOddsType;
    }

    setSelectedOddsType(type: string): void {
        console.log('[OddsStore] - Setting odds type from:', this.selectedOddsType, 'to:', type);
        this.selectedOddsType = type;
        console.log('[OddsStore] - Listeners count:', this.listeners.length);
        this.notifyListeners();
    }

    subscribe(listener: Listener): () => void {
        console.log('[OddsStore] - Adding new listener, total:', this.listeners.length + 1);
        this.listeners.push(listener);
        return () => {
            console.log('[OddsStore] - Removing listener');
            this.listeners = this.listeners.filter(l => l !== listener);
            console.log('[OddsStore] - Remaining listeners:', this.listeners.length);
        };
    }

    private notifyListeners(): void {
        console.log('[OddsStore] - Notifying', this.listeners.length, 'listeners');
        this.listeners.forEach((listener, index) => {
            console.log('[OddsStore] - Calling listener', index + 1);
            listener();
        });
    }

    // Test method to verify store is working
    testStore(): void {
        console.log('[OddsStore] - Current state:', {
            selectedOddsType: this.selectedOddsType,
            listenersCount: this.listeners.length
        });
    }
}

export const oddsStore = new OddsStore(); 